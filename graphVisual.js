'use strict';
// VARIABLES INITIALIZATION
const DISABLECONSOLELOG = true;
//declaration of graph struct and pixiGraph struct
const GRAPH = { "nodes": new Array(), "edges": new Array() };
let pixiGraph = new graphClass("");
const NODESDEGREE = new Map();
let labelsList = new Map();
const MAPLABELS = new Map();
let labelsDisplayedText;
const MAPVERTEXEDGES = new Map();

//re-inizialize console.log function,if testPerformace is true, to turn off log during tests
if (DISABLECONSOLELOG) {
    console.log = () => {};
}
//dimension of main rendering windows 
const WID = 1400;
const HIGH = 800;

//dimension of zoom windows
const WIDZOOM = 300;
const HIGHZOOM = 300;

//Aliases for pixi 
let Application = PIXI.Application,
    Graphics = PIXI.Graphics,
    Text = PIXI.Text;


//global constant value
const SCALEFACTOR = 10;
const RADIUS = 4;
let sigma  = 1.0;
let maxVal = {"value":0};//global maxvalue
let labelTemp;

let averageDegree;
let thresholdComp = 0.2;
let rangeFiledComp = 1;
let edgeThickness = 5;
let zoomIntens = 4;
let baseTextSize = 10;
let execPageRank = true;
let layoutComputCheck = true;


let raggioScalato = SCALEFACTOR*sigma*RADIUS;
//palette of colours
let normalScaleRedRGB = [[100,30,22],[123,36,28],[146,43,33],[169,50,38],[192,57,43],[205,97,85],[217,136,128],[230,176,170],[242,215,213],[249,235,234],[255,255,255]];
let scalaRedRGBRigirata = [[249,235,234],[242,215,213],[230,176,170],[217,136,128],[205,97,85],[192,57,43],[169,50,38],[146,43,33],[123,36,28],[100,30,22],[255,255,255]];
let scalaBluRGBRigirata = [[235,245,251],[214,234,248],[174,214,241],[133,193,233],[93,173,226],[52,152,219],[46,134,193],[40,116,166],[33,97,140],[27,79,114],[255,255,255]];
let scaleBlueAltRGBR2  = [[235,245,251],[202,240,248],[173,232,244],[144,224,239],[72,202,228],[0,180,216],[0,150,199],[0,119,182],[2,6,138],[3,4,94],[255,255,255]];
let scaleBlueAltRGBR3  = [[177,236,242],[147,228,239],[107,216,233],[71,214,236],[37,212,239],[37,202,239],[0,184,234],[0,178,227],[0,163,208],[0,145,189],[255,255,255]];
//scalaBluRGBRigirata = scaleBlueAltRGBR3;
//scalaBluRGBRigirata = scaleBlueAltRGBRigirata;
//declaration of sprite and texture for texture node computation
let sprite;
let texture;
//nodes and link variable global declaration
let nodes;
let links;

let selectedAreaZoom;
let viewportPosition = {x:0,y:0};

//slider variables 
let sliderSigma = document.getElementById("sigmaSlider");
let sliderThresholdAlpha = document.getElementById("thresholdAlphaSlider");
let sliderRangeField = document.getElementById("rangeFieldSlider");
let sliderMaxEdgeThickness = document.getElementById("maxEdgeThicknessSlider");
let sliderZoomIntensity = document.getElementById("zoomIntensitySlider");
let sliderTextLabels = document.getElementById("labelsFontSizeSlider");

let outputSigma = document.getElementById("sigmaDisplay");
let outputThresholdAlpha = document.getElementById("thresholdAlphaDisplay");
let outputSliderRangeField = document.getElementById("rangeFieldDisplay");
let outputSliderMaxEdgeThickness = document.getElementById("maxEdgeThicknessDisplay");
let outputSliderZoomIntensity = document.getElementById("zoomIntensityDisplay");
let outputSliderTextLablesSize = document.getElementById("labelsFontSizeDisplay")

thresholdComp = 0.20;
sliderThresholdAlpha.value = thresholdComp*100;
outputThresholdAlpha.innerHTML = thresholdComp.toFixed(2);


sliderTextLabels.value = baseTextSize*10;
outputSliderTextLablesSize.innerHTML = baseTextSize;
//variable for zoom and labels button 
let position ={};
let buttonActivation = {"zoomActivation":false,"labelsActivation":false}


//let mousedowncontroll = false;

document.getElementById("magnifying").style.visibility = 'hidden';


//pixi container for node and edges
let edgesContainer = new PIXI.Container();
let containerRoot = new PIXI.Container();
let containerLabels = new PIXI.Container();
let containerAdiacentLabels = new PIXI.Container();
let containerLabelsOnClick = new PIXI.Container();
let containerClickedPoint = new PIXI.Container();
//zoom
let containerRootZoom = new PIXI.Container();
let edgesContainerZoom = new PIXI.Container();
let containerLabelsZoom = new PIXI.Container();

//FAA for view of node and edges
//const ANTIALIASFILTER = new PIXI.filters.FXAAFilter();
//containerRoot.filters = [ANTIALIASFILTER];
//edgesContainer.filters = [ANTIALIASFILTER];
//zoom
//containerRootZoom.filters = [ANTIALIASFILTER];
//edgesContainerZoom.filters = [ANTIALIASFILTER];


//for zoom in and out without scrolling page
document.getElementById('graph').onwheel = () => false ;

fpsInitialize();

let inputs = document.querySelectorAll('.inputfile');
Array.prototype.forEach.call(inputs, function showName(input) {

    let labelVal = document.getElementById('labelInsert').innerHTML;

    input.addEventListener('change', function (e) {

        let fileName = ' ';

        fileName = e.target.value.split('\\')[2];

        fileName = fileName.split('\.')[0];

        (fileName)?document.getElementById('fileNameSpace').innerHTML = fileName:document.getElementById('fileNameSpace').innerHTML = labelVal ;
        
    });
});
 

//app pixi for main view space 
let app = new Application({
    width: WID,
    height: HIGH,
    backgroundColor: 0xFFFFFF,
    antialias: true
});

//app pixi for zoom space
let app2 = new Application({
    width: WIDZOOM,
    height: HIGHZOOM,
    backgroundColor: 0xFFFFFF,
    antialias: true
});

//Bind PIXI App canvas to element on page 
document.getElementById('magnifying').appendChild(app2.view);
document.getElementById('graph').appendChild(app.view);

//inizialization viewport for pan and zoom 
const VIEWPORT = new pixi_viewport.Viewport({
    screenWidth: WID,
    screenHeight: HIGH,
    worldWidth: WID,
    worldHeight: HIGH,
    interaction: app.renderer.plugins.interaction // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
})

//slider
//write on screen slider value
outputSigma.innerHTML = sliderSigma.value/100;
outputThresholdAlpha.innerHTML = sliderThresholdAlpha.value/100;
outputSliderRangeField.innerHTML = Math.round(sliderRangeField.value/10);
outputSliderMaxEdgeThickness.innerHTML = Math.round(sliderMaxEdgeThickness.value/10);
outputSliderZoomIntensity.innerHTML = sliderZoomIntensity.value;
outputSliderTextLablesSize.innerHTML = sliderTextLabels.value/10;

//re compute of texture after interaction with slider 

sliderSigma.onchange = function() {
    computeTexture(GRAPH,pixiGraph,VIEWPORT.scaled,containerRoot,edgesContainer,SCALEFACTOR,RADIUS,sigma,HIGH,WID,maxVal,scalaBluRGBRigirata,thresholdComp,rangeFiledComp,edgeThickness)
    if(buttonActivation.labelsActivation){
        containerLabels.removeChildren();
        containerLabelsOnClick.removeChildren()
        containerAdiacentLabels.removeChildren();
        labelsView(buttonActivation,baseTextSize,containerAdiacentLabels,pixiGraph,HIGH,WID,MAPLABELS,averageDegree,document.getElementById("seeAllLabels").checked,VIEWPORT,containerLabels,labelsList,position.xstart,position.ystart,GRAPH);

    }
}
sliderSigma.oninput = function() {
    outputSigma.innerHTML = this.value/100;
    sigma = this.value/100;
}
sliderThresholdAlpha.onchange  = function() {
    //computeTexture(graph,pixiGraph,viewport.scaled,containerRoot,edgesContainer,fattoreDiScala,raggio,sigma,high,wid,maxVal,scalaBluRGBRigirata,thresholdComp,rangeFiledComp,edgeThickness);
    edgeCompute(Math.round(Math.max(HIGH,WID)/2),WID,HIGH,pixiGraph,GRAPH.edges.length,GRAPH,edgesContainer,thresholdComp,edgeThickness);

}
sliderThresholdAlpha.oninput  = function() {
    thresholdComp = this.value/100;
    outputThresholdAlpha.innerHTML = thresholdComp;
}
sliderRangeField.onchange  = function() {
    computeTexture(GRAPH,pixiGraph,VIEWPORT.scaled,containerRoot,edgesContainer,SCALEFACTOR,RADIUS,sigma,HIGH,WID,maxVal,scalaBluRGBRigirata,thresholdComp,rangeFiledComp,edgeThickness);
}
sliderRangeField.oninput  = function() {
    rangeFiledComp = Math.round(this.value/10);
    outputSliderRangeField.innerHTML = rangeFiledComp;
}

sliderMaxEdgeThickness.onchange  = function() {
    //computeTexture(graph,pixiGraph,viewport.scaled,containerRoot,edgesContainer,fattoreDiScala,raggio,sigma,high,wid,maxVal,scalaBluRGBRigirata,thresholdComp,rangeFiledComp,edgeThickness);
    edgeCompute(Math.round(Math.max(HIGH,WID)/2),WID,HIGH,pixiGraph,GRAPH.edges.length,GRAPH,edgesContainer,thresholdComp,edgeThickness);

}
sliderMaxEdgeThickness.oninput  = function() {
    edgeThickness = Math.round(this.value/10);
    outputSliderMaxEdgeThickness.innerHTML = Math.round(this.value/10);
}

sliderZoomIntensity.oninput = function() {
    zoomIntens = this.value;
    outputSliderZoomIntensity.innerHTML = this.value;

}

sliderTextLabels.onchange = function() {
    if(buttonActivation.labelsActivation){
        containerLabels.removeChildren();
        containerAdiacentLabels.removeChildren();
        containerLabelsOnClick.removeChildren();
        labelsView(buttonActivation,baseTextSize,containerAdiacentLabels,pixiGraph,HIGH,WID,MAPLABELS,averageDegree,document.getElementById("seeAllLabels").checked,VIEWPORT,containerLabels,labelsList,position.xstart,position.ystart,GRAPH);
    }
}

sliderTextLabels.oninput = function() {
    outputSliderTextLablesSize.innerHTML =  Math.round(this.value/10);
    baseTextSize = Math.round(this.value/10);
}

//end of sidebar part
//viewport.plugins.plugins.wheel.options.percent, by default it is equal 0.1
//Pixiviewport of the main view space to manage pan and zoom in and out
VIEWPORT
    .drag()
    .wheel()
    .on('wheel', function(){
        //if(viewport.lastViewport.scaleX>0 && viewport.lastViewport.scaleX<=2){
        //    sigma = 0.4*(viewport.lastViewport.scaleX);
        //}
        sigma = 1.0+(1.0/60)*VIEWPORT.lastViewport.scaleX;
        sliderSigma.value = sigma*100;
        outputSigma.innerHTML = sigma.toFixed(3);

        thresholdComp = (1-(0.8+(0.20/60)*VIEWPORT.lastViewport.scaleX));
        sliderThresholdAlpha.value = thresholdComp*100;
        outputThresholdAlpha.innerHTML = thresholdComp.toFixed(3);
        

        //document.getElementById
        computeTexture(GRAPH,pixiGraph,VIEWPORT.scaled,containerRoot,edgesContainer,SCALEFACTOR,RADIUS,sigma,HIGH,WID,maxVal,scalaBluRGBRigirata,thresholdComp,rangeFiledComp,edgeThickness)
        if(buttonActivation.labelsActivation){
            containerLabels.visible = true;
            containerLabels.removeChildren();
            containerLabelsOnClick.removeChildren();
            containerAdiacentLabels.removeChildren();
            labelsView(buttonActivation,baseTextSize,containerAdiacentLabels,pixiGraph,HIGH,WID,MAPLABELS,averageDegree,document.getElementById("seeAllLabels").checked,VIEWPORT,containerLabels,labelsList,position.xstart,position.ystart,GRAPH);
        }
        if(buttonActivation.zoomActivation){  
            containerClickedPoint.removeChildren();
        }
    })
    .on('moved-end', function(){
        computeTexture(GRAPH,pixiGraph,VIEWPORT.scaled,containerRoot,edgesContainer,SCALEFACTOR,RADIUS,sigma,HIGH,WID,maxVal,scalaBluRGBRigirata,thresholdComp,rangeFiledComp,edgeThickness)
        if(buttonActivation.labelsActivation){
            containerLabels.visible = true;
            containerLabels.removeChildren();
            containerLabelsOnClick.removeChildren();
            containerAdiacentLabels.removeChildren()
            labelsView(buttonActivation,baseTextSize,containerAdiacentLabels,pixiGraph,HIGH,WID,MAPLABELS,averageDegree,document.getElementById("seeAllLabels").checked,VIEWPORT,containerLabels,labelsList,position.xstart,position.ystart,GRAPH);
        }
        if(buttonActivation.zoomActivation){  
            containerClickedPoint.removeChildren();
        }
    })
    .clampZoom({ minWidth: WID/60, minHeight: HIGH/60 })//max zoom
     
//button label actions
function searchLabel(){
   
    if(!buttonActivation.labelsActivation && !buttonActivation.zoomActivation){
        buttonActivation.labelsActivation = true;
        labelsView(buttonActivation,baseTextSize,containerAdiacentLabels,pixiGraph,HIGH,WID,MAPLABELS,averageDegree,document.getElementById("seeAllLabels").checked,VIEWPORT,containerLabels,labelsList,position.xstart,position.ystart,GRAPH);
        //viewport.pause = true;
    }else{
        buttonActivation.labelsActivation = false;
        containerLabels.visible = true;
        VIEWPORT.pause = false;
        containerLabels.removeChildren();
        containerLabelsOnClick.removeChildren();
        containerAdiacentLabels.removeChildren();
        containerLabelsZoom.removeChildren();

    }
}
//button zoom actions
function changestatuszoom(){

    if(!buttonActivation.zoomActivation){
        document.getElementById("magnifying").style.visibility = 'visible';
        buttonActivation.zoomActivation = true;
        //VIEWPORT.pause = true;
        document.body.style.cursor = "crosshair"
        
    }else{
        document.getElementById("magnifying").style.visibility = 'hidden';
        //VIEWPORT.pause = false;
        buttonActivation.zoomActivation = false;
        document.body.style.cursor = "default"
        containerRootZoom.removeChildren();
        edgesContainerZoom.removeChildren();
        containerLabelsZoom.removeChildren();
        containerLabelsOnClick.removeChildren();
        containerRootZoom.cacheAsBitmap = false;
        containerClickedPoint.removeChildren();

        computeTexture(GRAPH,pixiGraph,VIEWPORT.scaled,containerRoot,edgesContainer,SCALEFACTOR,RADIUS,sigma,HIGH,WID,maxVal,scalaBluRGBRigirata,thresholdComp,rangeFiledComp,edgeThickness)
        
    }
}
//mouse event listener for discover mouse position to compute zoom in a specific area


//selectedAreaZoom.beginFill(0xff0000);
//viewport.removeChild(selectedAreaZoom);

document.getElementById("graph").addEventListener("mousedown", function(e) {
    
    let rect = e.target.getBoundingClientRect();

    position.xstart = e.clientX-rect.left;
    position.ystart = e.clientY-rect.top; 

    position.xRing = e.clientX-rect.left
    position.yRing = e.clientY-rect.top; 

    position.xstart -= Math.ceil((200)/(zoomIntens));
    position.ystart -= Math.ceil((200)/(zoomIntens));

    position.xend = position.xstart;
    position.yend = position.ystart;

    if(buttonActivation.zoomActivation){  
        computeTextureZoom(baseTextSize,position.xstart,position.ystart,position.xend,position.yend,GRAPH,pixiGraph,VIEWPORT.scaled,containerRootZoom,edgesContainerZoom,containerLabelsZoom,SCALEFACTOR,RADIUS,sigma,HIGH,WID,maxVal,scalaBluRGBRigirata,thresholdComp,rangeFiledComp,edgeThickness,buttonActivation,VIEWPORT);
        containerClickedPoint.removeChildren();
        let ring = new PIXI.Graphics();
        ring.lineStyle(2,0x000000);
        ring.drawCircle(0,0,50);
        ring.x = position.xRing;
        ring.y = position.yRing;
        ring.endFill();
        containerClickedPoint.addChild(ring)
    }
 
});

//cambia secondo lo zoom quindi è da riverede
//document.getElementById("graph").addEventListener("mousemove", function(e){
//});

document.getElementById("graph").addEventListener("mouseup", function() {
    //mousedowncontroll = false;
    if(buttonActivation.labelsActivation && document.getElementById("labelsOnClick").checked && !buttonActivation.zoomActivation){
        labelsViewPoint(buttonActivation,baseTextSize,containerAdiacentLabels,pixiGraph,HIGH,WID,MAPLABELS,averageDegree,document.getElementById("seeAllLabels").checked,VIEWPORT,containerLabels,labelsList,position.xstart,position.ystart,GRAPH);
    }

    //if(buttonActivation.zoomActivation && !buttonActivation.labelsActivation){
        
        //selectedAreaZoom.x = position.xstart;
        //selectedAreaZoom.y = position.ystart;
        //selectedAreaZoom.visible = true;

        //viewport.addChild(selectedAreaZoom);
    //}

});

//extrapolation of data from file
document.getElementById('file').onchange = function () {
    
    execPageRank = document.getElementById('computePageRankCheckbox').checked;
    layoutComputCheck = document.getElementById('computeLayoutCheckbox').checked;
    let loadingDataStart = performance.now()

    if (GRAPH.nodes.length != 0) {
        resetParameters();
    }
    MAPVERTEXEDGES.clear();

    let file = this.files[0];
    let reader = new FileReader();
    let nodeTemp = new Array();
    let tempSet  = new Set();
    let edgeSet  = new Set();

    reader.onload = function (progressEvent) {

        let lines = this.result.split('\n');
        let linesLength = lines.length;
        if (file.name.match(/.json/i)) {

            for (let line = 0; line < (linesLength); line++) {
                if(lines[line]===""){break}
                let tab = lines[line].substring(1, lines[line].length - 2);
                let firstSplit = tab.split("[")
                let firstPart = firstSplit[0].split(",");
                let sourceNode = parseInt(firstPart[0]);
                let xSourceNode = firstPart[1];
                let ySourceNode = firstPart[2];
                let listNode = firstSplit[1].split(",");

                let sou = {
                    "id": sourceNode,
                }

                NODESDEGREE.set(sourceNode,listNode.length)
                
                if (!tempSet.has(sourceNode)) {
                    tempSet.add(sourceNode);
                    nodeTemp[sourceNode] = sou;
                    GRAPH.nodes.push(nodeTemp[sourceNode]);
                }

                //if the layout was precalculated
                if(!layoutComputCheck){

                    let circle = new Graphics();

                    circle.x = xSourceNode;
                    circle.y = ySourceNode;
                    

                    VIEWPORT.addChild(circle);
                    let nodeIns = new NodeClass(sourceNode,circle,circle.x,circle.y,1,listNode.length);

                    nodeIns.setPixel(xSourceNode,ySourceNode,0);
                    pixiGraph.insertNodes(nodeIns);

                }                 

                //mange link insertion 
                for (let i in listNode) {
                    let target = parseInt(listNode[i]);
                    let targ = {
                        "id": target
                    }
                    if (!tempSet.has(target)) {
                        tempSet.add(target);
                        nodeTemp[target] = targ;
                        GRAPH.nodes.push(nodeTemp[target]);
                    }
                    if(MAPVERTEXEDGES.has(sourceNode)){
                        MAPVERTEXEDGES.set(sourceNode,[...MAPVERTEXEDGES.get(sourceNode),target])
                    }else{
                        MAPVERTEXEDGES.set(sourceNode,[target])
                    }
                    //check to draw edges, from a to b and from b to a, only one time like a undirected graph
                    if(!edgeSet.has(""+sourceNode+target) && !edgeSet.has(""+target+sourceNode)){
                        GRAPH.edges.push({ "source": nodeTemp[sourceNode], "target": nodeTemp[target]});
                        edgeSet.add(""+sourceNode+target);
                    }
                }
            }
        } else if(file.name.match(/.txt/i)){

            //layoutComputCheck = true;

            for (let line = 0; line < linesLength; line++) {
                let tab;
                if(lines[line].includes(' ')){
                    tab = lines[line].split(' ');
                }else if(lines[line].includes('\t')){
                    tab = lines[line].split('\t');
                }else if(lines[line].includes(',')){
                    tab = lines[line].split(',');
                }else{
                    break 
                }

                let source = parseInt(tab[0]);
                let target = parseInt(tab[1]);     
                let xSource = (isNaN(parseFloat(tab[2]))) ? 0.0 : parseFloat(tab[2]);
                let ySource = (isNaN(parseFloat(tab[3]))) ? 0.0 : parseFloat(tab[3]);
                let xTarget = (isNaN(parseFloat(tab[4]))) ? 0.0 : parseFloat(tab[4]);
                let yTarget = (isNaN(parseFloat(tab[5]))) ? 0.0 : parseFloat(tab[5]);

              
                let sou = {
                    "id": source
                }
                let tar = {
                    "id"  : target
                }

                if (!tempSet.has(source)) {
                    NODESDEGREE.set(source,1);

                    nodeTemp[source] = sou;
                    tempSet.add(source);
                    GRAPH.nodes.push(nodeTemp[source]);
                    //create list of nightbour
                    MAPVERTEXEDGES.set(source,[target]);

                     //if the layout was precalculated
                    if(!layoutComputCheck){

                        let circle = new Graphics();

                        circle.x = xSource;
                        circle.y = ySource;
                        

                        VIEWPORT.addChild(circle);
                        let nodeIns = new NodeClass(source,circle,circle.x,circle.y,1,1);

                        nodeIns.setPixel(xSource,ySource,0);
                        pixiGraph.insertNodes(nodeIns);

                    }   
                }else{
                    NODESDEGREE.set(source,(NODESDEGREE.get(source)+1));
                    MAPVERTEXEDGES.set(source,[...MAPVERTEXEDGES.get(source),target])

                    if(!layoutComputCheck){
                        pixiGraph.pixiNodes[source].addOneDegree();
                    }
                }
                if (!tempSet.has(target)) {
                    NODESDEGREE.set(target,1);

                    nodeTemp[target] = tar;
                    tempSet.add(target);
                    GRAPH.nodes.push(nodeTemp[target]);

                    MAPVERTEXEDGES.set(target,[source])

                     //if the layout was precalculated
                    if(!layoutComputCheck){

                        let circle = new Graphics();

                        circle.x = xTarget;
                        circle.y = yTarget;
                        
                        /* circle.lineStyle(0)
                        circle.beginFill(0xDE3249, 1);
                        circle.drawCircle(1, 1, 1);
                        circle.endFill();
                        circle.visible = false;
 */
                        VIEWPORT.addChild(circle);
                        let nodeIns = new NodeClass(target,circle,circle.x,circle.y,1,1);

                        nodeIns.setPixel(xTarget,yTarget,0);
                        pixiGraph.insertNodes(nodeIns);

                    }   
                }else{
                    NODESDEGREE.set(target,(NODESDEGREE.get(target)+1));
                    MAPVERTEXEDGES.set(target,[...MAPVERTEXEDGES.get(target),source])

                    if(!layoutComputCheck){
                        pixiGraph.pixiNodes[target].addOneDegree();
                    }
                }

                GRAPH.edges.push({ "source": nodeTemp[source], "target": nodeTemp[target] });
            }
        } else if(file.name.match(/.gml/i)){
            let lines = this.result.split('\n');
            let directed = lines[1][10];
            let weighted = lines[2][10];

            for (let line = 3; line < (linesLength - 1); line++) {
                if(lines[line].match(/\snode\s\[/)){    
                    MAPLABELS.set(parseInt(lines[line+1].split(' ')[1]),lines[line+2].split('"')[1]);//1835
                }
                if(lines[line].match(/\sedge\s\[/)){
                    let source = parseInt(lines[line+1].split(' ')[1]);
                    let target = parseInt(lines[line+2].split(' ')[1]);     
                    
                    let sou = {
                        "id": source
                    }
                    let tar = {
                        "id"  : target
                    }

                    if (!tempSet.has(source)) {
                        NODESDEGREE.set(source,1);
                        nodeTemp[source] = sou;
                        tempSet.add(source);
                        GRAPH.nodes.push(nodeTemp[source]);
                         //create list of nightbour
                        MAPVERTEXEDGES.set(source,[target]);

                        
                    }else{
                        NODESDEGREE.set(source,(NODESDEGREE.get(source)+1));
                        //create list of nightbour
                        MAPVERTEXEDGES.set(source,[...MAPVERTEXEDGES.get(source),target])

                        
                    }
                    if (!tempSet.has(target)) {
                        NODESDEGREE.set(target,1);
                        nodeTemp[target] = tar;
                        tempSet.add(target);
                        GRAPH.nodes.push(nodeTemp[target]);  
                         //create list of nightbour
                        MAPVERTEXEDGES.set(target,[source]);
                  
                    }else{
                        NODESDEGREE.set(target,(NODESDEGREE.get(target)+1));
                        //create list of nightbour
                        MAPVERTEXEDGES.set(target,[...MAPVERTEXEDGES.get(target),source])

                    }
    
                    GRAPH.edges.push({ "source": nodeTemp[source], "target": nodeTemp[target] });
    
                }
                 
            }
        }
        
        
        edgeSet.clear();
        tempSet.clear();

        nodeTemp = null;

        let loadingDataEnd = performance.now()
        console.log("caricamento dati tempo : "+(loadingDataEnd-loadingDataStart));
        console.log("dati letti");
        averageDegree = 2*Math.round(GRAPH.edges.length/GRAPH.nodes.length);
        
        drawGraph(GRAPH,pixiGraph,VIEWPORT,document);


    };
    reader.readAsText(file,'ISO-8859-1');
    reader = null;
};
//function that is executed after file loading 
function drawGraph(graph,pixiGraph,viewport,document) {

    
    document.getElementById('nodePrintSpace').innerHTML = graph.nodes.length;
    document.getElementById('edgesPrintSpace').innerHTML = graph.edges.length;          
    let t0 = performance.now()            

    //to modify the if else adding a variable to check if the user want to compute or not the network's layout

    if(execPageRank && layoutComputCheck){
        startWorkerLayoutAndPageRank(firstLayoutCompute,graph,viewport,pixiGraph,t0);
        document.getElementById('pageRankYesOrNo').innerHTML = "on"

    }else if(execPageRank  && !layoutComputCheck){
        startWorkerPageRank(firstLayoutCompute,graph,pixiGraph,t0);
        document.getElementById('pageRankYesOrNo').innerHTML = "on"

    }else if(!execPageRank && layoutComputCheck){
        startWorkerLayout(firstLayoutCompute,graph,viewport,pixiGraph,t0);
        //document.getElementById('pageRankYesOrNo').innerHTML = "off"

    }else if(!execPageRank && !layoutComputCheck){
        for(let k = 0;k<graph.nodes;k++){
            if(pixiGraph.pixiNodes[graph.nodes[k]]!=undefined){
                pixiGraph.pixiNodes[graph.nodes[k]].setArchList(MAPVERTEXEDGES.get(graph.nodes[k]));
            }
        }
        firstLayoutCompute(t0,t0,t0)
        document.getElementById('pageRankYesOrNo').innerHTML = "off"

    }

}
//function that call layout function + render function
function firstLayoutCompute(t0fmmm,t1fmmm,t0){

    computeTexture(GRAPH,pixiGraph,VIEWPORT.scaled,containerRoot,edgesContainer,SCALEFACTOR,RADIUS,sigma,HIGH,WID,maxVal,scalaBluRGBRigirata,thresholdComp,rangeFiledComp,edgeThickness);

    app.stage.addChild(containerRoot);
    app.stage.addChild(VIEWPORT);
    app.stage.addChild(edgesContainer);
    app.stage.addChild(containerLabels);
    app.stage.addChild(containerLabelsOnClick)
    app.stage.addChild(containerAdiacentLabels);
    app.stage.addChild(containerClickedPoint);
    app2.stage.addChild(containerRootZoom);
    app2.stage.addChild(edgesContainerZoom);
    app2.stage.addChild(containerLabelsZoom);

    let t1 = performance.now();

    console.log(`Time needed to compute Layout: ${t1fmmm - t0fmmm}  milliseconds.`);

    console.log(`Time needed to compute Layout + Render : ${(t1 - t0)}  milliseconds.`);
    document.getElementById('layoutTimePrintSpace').innerHTML = (t1fmmm - t0fmmm).toFixed();
    document.getElementById('totalTimePrintSpace').innerHTML = (t1 - t0).toFixed();
            
    console.log("finish");

}
//start of worker for gradability
function startWorkerGreadability() {

    console.log("start worker")
    if (typeof (Worker) !== "undefined") {

        let ww = new Worker("workers/greadabilityWorker.js");
        document.getElementById('infoGreadZone').innerHTML = "Loading...";

        ww.postMessage(GRAPH);
        ww.onmessage = function (e) {

            if (e.data == false) {
                document.getElementById('infoGreadZone').innerHTML = "Graph is needed to compute the greadability";
                ww.terminate();
            } else {
                document.getElementById('infoGreadZone').innerHTML = " ";

                document.getElementById('ARDDesc').innerHTML = '<div class="tooltip">ARD:<span class="tooltiptext">Angular resoluction (deviation) measures the average deviation of angles between incident edges on each vertex.</span></div>';
                document.getElementById('ARDRis').innerHTML = e.data.angularResolutionDev.toFixed(4);
                document.getElementById('ARMDesc').innerHTML =  '<div class="tooltip">ARM:<span class="tooltiptext">Angular resolution (minimum) measures the mean deviation of adjacent incident edge angles from the ideal minimum angles (360 degrees divided by the degree of that node).</span></div>';
                document.getElementById('ARMRis').innerHTML = e.data.angularResolutionMin.toFixed(4)
                document.getElementById('CDesc').innerHTML =  '<div class="tooltip">C:<span class="tooltiptext"> Edge crossings measures the fraction of edges that cross (intersect) out of an approximate maximum number that can cross.</span></div>';
                document.getElementById('CRis').innerHTML = e.data.crossing.toFixed(4);
                document.getElementById('CADesc').innerHTML = '<div class="tooltip">CA:<span class="tooltiptext"> Edge crossing angle measures the mean deviation of edge crossing angles from the ideal edge crossing angle (70 degrees).</span></div>';
                document.getElementById('CARis').innerHTML = e.data.crossingAngle.toFixed(4);
                ww.terminate();

            }       
        }
    } else {
        console.log("Worker is undefined")
    }

}
//layout worker function 
async function startWorkerLayout(callback,graphWork,viewport,pixiGraph,t0) {
    let t0fmmm = performance.now();

    let promise =  new Promise(function(resolve,reject){
        console.log("start worker")
        if (typeof (Worker) !== "undefined") {
            let w = new Worker("workers/layoutComputingWorker.js");
            w.postMessage(graphWork);
            w.onmessage = function (e) {
                let nodes = e.data.nodes.length;
            
                if(e.data.maxX>WID || e.data.maxY>HIGH){
                    
                    for (let i = 0; i < nodes; ++i) {
                        let circle = new Graphics();
                                               
                        let xxx = Math.round((e.data.nodes[i]['x']/e.data.maxX)*(WID));
                        let yyy = Math.round((e.data.nodes[i]['y']/e.data.maxY)*(HIGH));

                        GRAPH.nodes[i]['x'] = xxx;
                        GRAPH.nodes[i]['y'] = yyy;

                        circle.x = xxx;
                        circle.y = yyy;
                        
                        viewport.addChild(circle);

                        let nodeIns = new NodeClass(e.data.nodes[i]['id'],circle,circle.x,circle.y,1,NODESDEGREE.get(e.data.nodes[i]['id']),MAPVERTEXEDGES.get(e.data.nodes[i]['id']));
                        nodeIns.setPixel(xxx,yyy,0);
                        pixiGraph.insertNodes(nodeIns);
                
                    }
                }else{       
                    for (let i = 0; i < nodes; ++i) {
                        let circle = new Graphics();

                        GRAPH.nodes[i]['x'] = e.data.nodes[i]['x'];
                        GRAPH.nodes[i]['y'] = e.data.nodes[i]['y'];
                  
                        circle.x = e.data.nodes[i]['x'];
                        circle.y = e.data.nodes[i]['y'];
                       
                        viewport.addChild(circle);
                        
                        let nodeIns = new NodeClass(e.data.nodes[i]['id'],circle,circle.x,circle.y,1,NODESDEGREE.get(e.data.nodes[i]['id']),MAPVERTEXEDGES.get(e.data.nodes[i]['id']));
                        nodeIns.setPixel(e.data.nodes[i]['x'],e.data.nodes[i]['y'],0);
                        pixiGraph.insertNodes(nodeIns);

                    }
                }    
                w.terminate();
                resolve("layout was calculeted")
            }
        } else {
            reject("Worker is undefined")
        }
    })

    let result = await promise;
    let t1fmmm = performance.now();

    callback(t0fmmm,t1fmmm,t0)

}
//layout worker function with page rank 
async function startWorkerLayoutAndPageRank(callback,graphWork,viewport,pixiGraph,t0) {
    let t0fmmm = performance.now();

    let promise =  new Promise(function(resolve,reject){
        console.log("start worker")
        if (typeof (Worker) !== "undefined") {
            let w = new Worker("workers/layoutComputingWorkersAndPageRank.js");
            w.postMessage(graphWork);
            w.onmessage = function (e) {
                let nodes = e.data.nodes.length;
                
                if(e.data.maxX>WID || e.data.maxY>HIGH){
                    
                    for (let i = 0; i < nodes; ++i) {
                        let circle = new Graphics();

                        let xxx = Math.round((e.data.nodes[i]['x']/e.data.maxX)*(WID));
                        let yyy = Math.round((e.data.nodes[i]['y']/e.data.maxY)*(HIGH));

                        GRAPH.nodes[i]['x'] = xxx;
                        GRAPH.nodes[i]['y'] = yyy;

                        circle.x = xxx;
                        circle.y = yyy;
                                            

                        viewport.addChild(circle);
                        //arrotondo i pesi cosi da avere solo 10 differenti pesi 
                        let temp = parseFloat(e.data.nodes[i]['weight']);
                        //let temp = 1;                    

                        let nodeIns = new NodeClass(e.data.nodes[i]['id'],circle,circle.x,circle.y,temp,NODESDEGREE.get(e.data.nodes[i]['id']),MAPVERTEXEDGES.get(e.data.nodes[i]['id']));
                        nodeIns.setPixel(xxx,yyy,0);
                        pixiGraph.insertNodes(nodeIns);
                
                    }
                }else{       
                    for (let i = 0; i < nodes; ++i) {
                        let circle = new Graphics();

                        GRAPH.nodes[i]['x'] = e.data.nodes[i]['x'];
                        GRAPH.nodes[i]['y'] = e.data.nodes[i]['y'];

                        circle.x = e.data.nodes[i]['x'];
                        circle.y = e.data.nodes[i]['y'];

                         
                        
                        viewport.addChild(circle);

                        //arrotondo i pesi cosi da avere solo 10 differenti pesi 
                        let temp = parseFloat(e.data.nodes[i]['weight']);
                        
                        //let temp = 1;

                        let nodeIns = new NodeClass(e.data.nodes[i]['id'],circle,circle.x,circle.y,temp,NODESDEGREE.get(e.data.nodes[i]['id']),MAPVERTEXEDGES.get(e.data.nodes[i]['id']));
                        nodeIns.setPixel(e.data.nodes[i]['x'],e.data.nodes[i]['y'],0);
                        pixiGraph.insertNodes(nodeIns);

                    }
                }    
                w.terminate();
                resolve("layout was calculeted")
            }
        } else {
            reject("Worker is undefined")
        }
    })

    let result = await promise;
    let t1fmmm = performance.now();

    callback(t0fmmm,t1fmmm,t0)

}
//pagerank worker 
async function startWorkerPageRank(callback,graphWork,pixiGraph,t0) {
    let t0fmmm = performance.now();

    let promise =  new Promise(function(resolve,reject){
        console.log("start worker")
        if (typeof (Worker) !== "undefined") {
            let w = new Worker("workers/pagerankComputing.js");
            w.postMessage(graphWork);
            w.onmessage = function (e) {
                let nodes = e.data.nodes.length;
            
                for (let i = 0; i < nodes; ++i) {                    
                    let temp = parseFloat(e.data.nodes[i]['weight']);
                    pixiGraph.pixiNodes[GRAPH.nodes[i]['id']].setWeight(temp);
                }
            
                w.terminate();
                resolve("layout was calculeted")
            }
        } else {
            reject("Worker is undefined")
        }
    })

    let result = await promise;
    let t1fmmm = performance.now();

    callback(t0fmmm,t1fmmm,t0)

}
//reset all the parameters
function resetParameters(){

    //reset of graph values and pixi containers
    pixiGraph = new graphClass("");
    NODESDEGREE.clear();
    GRAPH.nodes.length = 0;
    GRAPH.edges.length = 0;
    //viewport reset
    VIEWPORT.removeChildren();
    VIEWPORT.scaled = 1;
    VIEWPORT.center = {x: 600, y: 400};
    //container reset
    containerRoot.cacheAsBitmap = false;
    containerRootZoom.cacheAsBitmap = false;
    containerRoot.removeChildren();
    edgesContainer.removeChildren();
    edgesContainerZoom.removeChildren();
    containerRootZoom.removeChildren();
    containerAdiacentLabels.removeChildren();
    containerLabelsOnClick.removeChildren();
    containerLabels.removeChildren();
    containerLabelsZoom.removeChildren();
    //slider parameters

    sigma = 0.5;
    thresholdComp= 0.2;
    rangeFiledComp = 1;
    edgeThickness = 5;

    document.getElementById("sigmaDisplay").innerHTML = 0.5;
    document.getElementById("thresholdAlphaDisplay").innerHTML=0.2;
    document.getElementById("rangeFieldDisplay").innerHTML=1;
    document.getElementById("maxEdgeThicknessDisplay").innerHTML=5;
    document.getElementById("zoomIntensityDisplay").innerHTML=4;

    document.getElementById('pageRankYesOrNo').innerHTML = "";
    document.getElementById('nodePrintSpace').innerHTML = "";
    document.getElementById('edgesPrintSpace').innerHTML = "";
    document.getElementById('layoutTimePrintSpace').innerHTML = "";
    document.getElementById('totalTimePrintSpace').innerHTML = "";

    document.getElementById("sigmaSlider").value = 50;
    document.getElementById("thresholdAlphaSlider").value = 20;
    document.getElementById("rangeFieldSlider").value = 1;
    document.getElementById("maxEdgeThicknessSlider").value = 50;
    document.getElementById("zoomIntensitySlider").value = 4;

    //greadability parameters
    document.getElementById('infoGreadZone').innerHTML = "";
    document.getElementById('ARDDesc').innerHTML = "";
    document.getElementById('ARDRis').innerHTML ="";
    document.getElementById('ARMDesc').innerHTML =  "";
    document.getElementById('ARMRis').innerHTML = "";
    document.getElementById('CDesc').innerHTML =  "";
    document.getElementById('CRis').innerHTML = "";
    document.getElementById('CADesc').innerHTML ="";
    document.getElementById('CARis').innerHTML = "";
    
   
}
//Fps monitorining system 
function fpsInitialize(){

    //Fps monitorining system 
    let stats = new Stats();
    stats.dom.style.position = 'relative';
    stats.dom.style.float = 'left';
    stats.dom.style.margin = '10px'
    document.getElementById("fpsmeterstat").appendChild( stats.dom );

    function animate() {
        stats.update();
        requestAnimationFrame( animate );
    }

    animate();

}