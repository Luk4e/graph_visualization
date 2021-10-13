
//for zoom in and out without scrolling page
 document.getElementById('graph').onwheel = function(){ return false; }

 //Fps monitorining system 
 var stats = new Stats();
 stats.dom.style.position = 'relative';
 stats.dom.style.float = 'right';
 document.getElementById("fpsmeterstat").appendChild( stats.dom );

 function animate() {
     stats.update();
     requestAnimationFrame( animate );
 }

 animate();


var inputs = document.querySelectorAll('.inputfile');
Array.prototype.forEach.call(inputs, function (input) {

    var labelVal = document.getElementById('labelInsert').innerHTML;

    input.addEventListener('change', function (e) {

        var fileName = ' ';

        fileName = e.target.value.split('\\')[2];

        fileName = fileName.split('\.')[0];

        if (fileName)
            document.getElementById('fileNameSpace').innerHTML = fileName ;
        else
            document.getElementById('fileNameSpace').innerHTML = labelVal ;
        
    });
});
 
//declaration of graph struct and pixiGraph struct
const graph = { "nodes": new Array(), "edges": new Array() };
const pixiGraph = new graphClass("Primo");
const nodesDegree = new Map();

//dimension of main rendering windows 
const wid = 1200;
const high = 800;

//dimension of zoom windows
const wid2 = 385;
const high2 = 385;

//Aliases for pixi 
let Application = PIXI.Application,
    Graphics = PIXI.Graphics,
    Text = PIXI.Text;

//app pixi for main view space 
let app = new Application({
    width: wid,
    height: high,
    backgroundColor: 0xFFFFFF
});

//app pixi for zoom space
let app2 = new Application({
    width: wid2,
    height: high2,
    backgroundColor: 0xFFFFFF
});


//inizialization viewport for pan and zoom 
const viewport = new pixi_viewport.Viewport({
    screenWidth: wid,
    screenHeight: high,
    worldWidth: wid,
    worldHeight: high,
    interaction: app.renderer.plugins.interaction // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
})


//global constant value
const fattoreDiScala = 10;
const raggio = 4;
var sigma  = 0.5;
var maxVal = {};//global maxvalue
maxVal.value = 0;

var thresholdComp = 0.2;
var rangeFiledComp = 1;
var edgeThickness = 5;
var zoomIntens = 4;
var execPageRank = true;
let layoutComputCheck = true;



var raggioScalato = fattoreDiScala*sigma*raggio;
//palette of colours
var normalScaleRedRGB = [[100,30,22],[123,36,28],[146,43,33],[169,50,38],[192,57,43],[205,97,85],[217,136,128],[230,176,170],[242,215,213],[249,235,234],[255,255,255]];
var scalaRedRGBRigirata = [[249,235,234],[242,215,213],[230,176,170],[217,136,128],[205,97,85],[192,57,43],[169,50,38],[146,43,33],[123,36,28],[100,30,22],[255,255,255]];
var scalaBluRGBRigirata = [[235,245,251],[214,234,248],[174,214,241],[133,193,233],[93,173,226],[52,152,219],[46,134,193],[40,116,166],[33,97,140],[27,79,114],[255,255,255]];

//declaration of sprite and texture for texture node computation
var sprite ;
var texture;
//nodes and link variable global declaration
var nodes;
var links;


//slider parte 
var sliderSigma = document.getElementById("sigmaSlider");
var sliderThresholdAlpha = document.getElementById("thresholdAlphaSlider");
var sliderRangeField = document.getElementById("rangeFieldSlider");
var sliderMaxEdgeThickness = document.getElementById("maxEdgeThicknessSlider");
var sliderZoomIntensity = document.getElementById("zoomIntensitySlider");

var outputSigma = document.getElementById("sigmaDisplay");
var outputThresholdAlpha = document.getElementById("thresholdAlphaDisplay");
var outputSliderRangeField = document.getElementById("rangeFieldDisplay");
var outputSliderMaxEdgeThickness = document.getElementById("maxEdgeThicknessDisplay");
var outputSliderZoomIntensity = document.getElementById("zoomIntensityDisplay");

//write on screen slider value
outputSigma.innerHTML = sliderSigma.value/100;
outputThresholdAlpha.innerHTML = sliderThresholdAlpha.value/100;
outputSliderRangeField.innerHTML = Math.round(sliderRangeField.value/10);
outputSliderMaxEdgeThickness.innerHTML = Math.round(sliderMaxEdgeThickness.value/10);
outputSliderZoomIntensity.innerHTML = sliderZoomIntensity.value;

//re compute of texture after interaction with slider 

sliderSigma.oninput = function() {
    outputSigma.innerHTML = this.value/100;
    sigma = this.value/100;
    computeTexture(graph,pixiGraph,viewport.scaled,containerRoot,fattoreDiScala,raggio,sigma,high,wid,maxVal,scalaBluRGBRigirata,thresholdComp,rangeFiledComp,edgeThickness)
}
sliderThresholdAlpha.oninput  = function() {
    thresholdComp = this.value/100;
    outputThresholdAlpha.innerHTML = thresholdComp;
    computeTexture(graph,pixiGraph,viewport.scaled,containerRoot,fattoreDiScala,raggio,sigma,high,wid,maxVal,scalaBluRGBRigirata,thresholdComp,rangeFiledComp,edgeThickness)

}
sliderRangeField.oninput  = function() {
    rangeFiledComp = Math.round(this.value/10);
    outputSliderRangeField.innerHTML = rangeFiledComp;
    computeTexture(graph,pixiGraph,viewport.scaled,containerRoot,fattoreDiScala,raggio,sigma,high,wid,maxVal,scalaBluRGBRigirata,thresholdComp,rangeFiledComp,edgeThickness)

}
sliderMaxEdgeThickness.oninput  = function() {
    edgeThickness = Math.round(this.value/10);
    outputSliderMaxEdgeThickness.innerHTML = Math.round(this.value/10);
    computeTexture(graph,pixiGraph,viewport.scaled,containerRoot,fattoreDiScala,raggio,sigma,high,wid,maxVal,scalaBluRGBRigirata,thresholdComp,rangeFiledComp,edgeThickness)

}
sliderZoomIntensity.oninput  = function() {
    zoomIntens = this.value;
    outputSliderZoomIntensity.innerHTML = this.value;

}
//end of sidebar part

var position ={};
var zoomOnPoint = {}
zoomOnPoint.value = false;


//Pixiviewport of the main view space to manage pan and zoom in and out
viewport
    .drag()
    .wheel({percent:0.1})
    .on('wheel', function(){
        computeTexture(graph,pixiGraph,viewport.scaled,containerRoot,fattoreDiScala,raggio,sigma,high,wid,maxVal,scalaBluRGBRigirata,thresholdComp,rangeFiledComp,edgeThickness)
    })
    .on('moved', function(){
        computeTexture(graph,pixiGraph,viewport.scaled,containerRoot,fattoreDiScala,raggio,sigma,high,wid,maxVal,scalaBluRGBRigirata,thresholdComp,rangeFiledComp,edgeThickness)
    }) 





document.getElementById("magnifying").style.visibility = 'hidden';

function changestatuszoom(){

    if(!zoomOnPoint.value){
        document.getElementById("magnifying").style.visibility = 'visible';
        zoomOnPoint.value = true;
        viewport.pause = true;
        document.body.style.cursor = "crosshair"
    }else{
        document.getElementById("magnifying").style.visibility = 'hidden';
        viewport.pause = false;
        zoomOnPoint.value = false;
        document.body.style.cursor = "default"
        containerRootZoom.removeChildren();
        edgesContainerZoom.removeChildren();
        containerRootZoom.cacheAsBitmap = false;


    }
}
//mouse event listener for discover mouse position to compute zoom in a specific area
var mousedowncontroll = false;
document.getElementById("graph").addEventListener("mousedown", function() {
    mousedowncontroll = true;
});
document.getElementById("graph").addEventListener("mousemove", function(){
    if(mousedowncontroll){

        let e = window.event;
        let rect = e.target.getBoundingClientRect();

        position.xstart = e.clientX-rect.left;
        position.ystart = e.clientY-Math.ceil(rect.top); 

        position.xstart -= Math.ceil((200)/(zoomIntens));
        position.ystart -= Math.ceil((200)/(zoomIntens));

        position.xend = position.xstart;
        position.yend = position.ystart;

        if(zoomOnPoint.value){
            computeTextureZoom(position.xstart,position.ystart,position.xend,position.yend,graph,pixiGraph,viewport.scaled,containerRootZoom,fattoreDiScala,raggio,sigma,high,wid,maxVal,scalaBluRGBRigirata,thresholdComp,rangeFiledComp,edgeThickness);
        }
    }

});
document.getElementById("graph").addEventListener("mouseup", function() {
    mousedowncontroll = false;
});
//pixi container for node and edges
var edgesContainer = new PIXI.Container();
var containerRoot = new PIXI.Container();
//zoom
var containerRootZoom = new PIXI.Container();
var edgesContainerZoom = new PIXI.Container();

//FAA for view of node and edges
const blurFilter1 = new PIXI.filters.FXAAFilter();
containerRoot.filters = [blurFilter1];
edgesContainer.filters = [blurFilter1];
//zoom
containerRootZoom.filters = [blurFilter1];
edgesContainerZoom.filters = [blurFilter1];

//Bind PIXI App canvas to element on page 
document.getElementById('magnifying').appendChild(app2.view);
document.getElementById('graph').appendChild(app.view);

//extrapolation of data from file
document.getElementById('file').onchange = function () {
    
    execPageRank = window.confirm("Do you want to use PageRank?");
    layoutComputCheck = window.confirm("Do you want to compute network's layout?");

    let loadingDataStart = performance.now()

    if (graph.nodes.length != 0) {
        resetParameters();
    }

    var file = this.files[0];
    var reader = new FileReader();

    let nodeTemp = new Array();
    let tempSet  = new Set();

    const styleFont = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 6,
    });

    reader.onload = function (progressEvent) {

        var lines = this.result.split('\n');
        let linesLength = lines.length;
        if (this.result[0] == "[") {

            for (let line = 0; line < (linesLength - 1); line++) {

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
                nodesDegree.set(sourceNode,listNode.length)
                
                if (!tempSet.has(sourceNode)) {
                    tempSet.add(sourceNode);
                    nodeTemp[sourceNode] = sou;
                    graph.nodes.push(nodeTemp[sourceNode]);
                }

                //if the layout was precalculated
                if(!layoutComputCheck){
                    let circleText = new PIXI.Text(sourceNode,styleFont)
                    circleText.x = xSourceNode;
                    circleText.y = ySourceNode;

                    circleText.visible = false;
                    viewport.addChild(circleText);

                    let nodeIns = new NodeClass(sourceNode,circleText,circleText.x,circleText.y,1,listNode.length);

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
                        graph.nodes.push(nodeTemp[target]);
                    }

                    graph.edges.push({ "source": nodeTemp[sourceNode], "target": nodeTemp[target] });
                }
            }
        } else {

            //layoutComputCheck = true;

            for (var line = 0; line < linesLength; line++) {
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
                    nodesDegree.set(source,1);

                    nodeTemp[source] = sou;
                    tempSet.add(source);
                    graph.nodes.push(nodeTemp[source]);
                     //if the layout was precalculated
                    if(!layoutComputCheck){
                        let circleText = new PIXI.Text(source,styleFont)
                        circleText.x = xSource;
                        circleText.y = ySource;

                        circleText.visible = false;
                        viewport.addChild(circleText);

                        let nodeIns = new NodeClass(source,circleText,circleText.x,circleText.y,1,1);

                        nodeIns.setPixel(xSource,ySource,0);
                        pixiGraph.insertNodes(nodeIns);
                    }   
                }else{
                    nodesDegree.set(source,(nodesDegree.get(source)+1));
                    if(!layoutComputCheck){
                        pixiGraph.pixiNodes[source].addOneDegree();
                    }
                }
                if (!tempSet.has(target)) {
                    nodesDegree.set(target,1);

                    nodeTemp[target] = tar;
                    tempSet.add(target);
                    graph.nodes.push(nodeTemp[target]);
                     //if the layout was precalculated
                    if(!layoutComputCheck){
                        let circleText = new PIXI.Text(target,styleFont)
                        circleText.x = xTarget;
                        circleText.y = yTarget;

                        circleText.visible = false;
                        viewport.addChild(circleText);

                        let nodeIns = new NodeClass(target,circleText,circleText.x,circleText.y,1,1);

                        nodeIns.setPixel(xTarget,yTarget,0);
                        pixiGraph.insertNodes(nodeIns);
                    }   
                }else{
                    nodesDegree.set(target,(nodesDegree.get(target)+1));
                    if(!layoutComputCheck){
                        pixiGraph.pixiNodes[target].addOneDegree();
                    }
                }




                graph.edges.push({ "source": nodeTemp[source], "target": nodeTemp[target] });
            }
        }

        nodeTemp = null;
        tempSet = null;
        tab = null;
        let loadingDataEnd = performance.now()
        console.log("caricamento dati tempo : "+(loadingDataEnd-loadingDataStart));
        console.log("dati letti ");

        drawGraph(graph,pixiGraph,viewport,document);


    };
    reader.readAsText(file);
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
        document.getElementById('pageRankYesOrNo').innerHTML = "off"

    }else if(!execPageRank && !layoutComputCheck){
        firstLayoutCompute(t0,t0,t0)
        document.getElementById('pageRankYesOrNo').innerHTML = "off"

    }

}
//function that call layout function + render function
function firstLayoutCompute(t0fmmm,t1fmmm,t0){

    computeTexture(graph,pixiGraph,viewport.scaled,containerRoot,fattoreDiScala,raggio,sigma,high,wid,maxVal,scalaBluRGBRigirata,thresholdComp,rangeFiledComp,edgeThickness);

    app.stage.addChild(containerRoot);
    app.stage.addChild(viewport);
    app.stage.addChild(edgesContainer);

    /////////////////////////////////////////////

    app2.stage.addChild(containerRootZoom);
    app2.stage.addChild(edgesContainerZoom);

    let t1 = performance.now();

    console.log("Time needed to compute layout: "  + (t1fmmm - t0fmmm) + " milliseconds.");

    document.getElementById('layoutTimePrintSpace').innerHTML = (t1fmmm - t0fmmm).toFixed();
    document.getElementById('totalTimePrintSpace').innerHTML = (t1 - t0).toFixed();
            
    console.log("finish");

}

//start of worker for gradability
function startWorkerGreadability() {

    console.log("start worker")
    if (typeof (Worker) !== "undefined") {

        ww = new Worker("workers/greadabilityWorker.js");
        document.getElementById('infoGreadZone').innerHTML = "Loading...";

        ww.postMessage(graph);
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
            w = new Worker("workers/layoutComputingWorker.js");
            w.postMessage(graphWork);
            w.onmessage = function (e) {
                let nodes = e.data.nodes.length;
            
                if(e.data.maxX>wid || e.data.maxY>high){
                    
                    for (let i = 0; i < nodes; ++i) {
                        //let circle = new Graphics();
                        const styleFont = new PIXI.TextStyle({
                            fontFamily: 'Arial',
                            fontSize: 6,
                        });
                        let circleText = new PIXI.Text(e.data.nodes[i]['id'],styleFont)


                        let xxx = Math.round((e.data.nodes[i]['x']/e.data.maxX)*(wid));
                        let yyy = Math.round((e.data.nodes[i]['y']/e.data.maxY)*(high));

                        graph.nodes[i]['x'] = xxx;
                        graph.nodes[i]['y'] = yyy;


                        //circle.x = xxx;
                        //circle.y = yyy;
                        circleText.x = xxx;
                        circleText.y = yyy;

                        circleText.visible = false;
                        //viewport.addChild(circle);
                        viewport.addChild(circleText);


                        //let nodeIns = new NodeClass(e.data.nodes[i]['id'],circle,circle.x,circle.y,1);
                        let nodeIns = new NodeClass(e.data.nodes[i]['id'],circleText,circleText.x,circleText.y,1,nodesDegree.get(e.data.nodes[i]['id']));

                        nodeIns.setPixel(xxx,yyy,0);
                        pixiGraph.insertNodes(nodeIns);
                
                    }
                }else{       
                    for (let i = 0; i < nodes; ++i) {
                        //let circle = new Graphics();
                        let circleText = new PIXI.Text(e.data.nodes[i]['id'])


                        graph.nodes[i]['x'] = e.data.nodes[i]['x'];
                        graph.nodes[i]['y'] = e.data.nodes[i]['y'];
                  
                        //circle.x = e.data.nodes[i]['x'];
                        //circle.y = e.data.nodes[i]['y'];
                       
                        circleText.x = e.data.nodes[i]['x'];
                        circleText.y = e.data.nodes[i]['y'];
                        circleText.visible = false;
                        //viewport.addChild(circle);
                        viewport.addChild(circleText);
                        
                        //let nodeIns = new NodeClass(e.data.nodes[i]['id'],circle,circle.x,circle.y,1);
                        
                        let nodeIns = new NodeClass(e.data.nodes[i]['id'],circleText,circleText.x,circleText.y,1,nodesDegree.get(e.data.nodes[i]['id']));

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
            w = new Worker("workers/layoutComputingWorkersAndPageRank.js");
            w.postMessage(graphWork);
            w.onmessage = function (e) {
                let nodes = e.data.nodes.length;
                
                if(e.data.maxX>wid || e.data.maxY>high){
                    
                    for (let i = 0; i < nodes; ++i) {
                        let circle = new Graphics();

                        let xxx = Math.round((e.data.nodes[i]['x']/e.data.maxX)*(wid));
                        let yyy = Math.round((e.data.nodes[i]['y']/e.data.maxY)*(high));

                        graph.nodes[i]['x'] = xxx;
                        graph.nodes[i]['y'] = yyy;

                        circle.x = xxx;
                        circle.y = yyy;
                        viewport.addChild(circle);
                        //arrotondo i pesi cosi da avere solo 10 differenti pesi 
                        let temp = parseFloat(e.data.nodes[i]['weight']);
                        //let temp = 1;
                        

                        let nodeIns = new NodeClass(e.data.nodes[i]['id'],circle,circle.x,circle.y,temp,nodesDegree.get(e.data.nodes[i]['id']));
                        nodeIns.setPixel(xxx,yyy,0);
                        pixiGraph.insertNodes(nodeIns);
                
                    }
                }else{       
                    for (let i = 0; i < nodes; ++i) {
                        let circle = new Graphics();

                        graph.nodes[i]['x'] = e.data.nodes[i]['x'];
                        graph.nodes[i]['y'] = e.data.nodes[i]['y'];

                        circle.x = e.data.nodes[i]['x'];
                        circle.y = e.data.nodes[i]['y'];
                        viewport.addChild(circle);

                        //arrotondo i pesi cosi da avere solo 10 differenti pesi 
                        let temp = parseFloat(e.data.nodes[i]['weight']);
                        
                        //let temp = 1;

                        let nodeIns = new NodeClass(e.data.nodes[i]['id'],circle,circle.x,circle.y,temp,nodesDegree.get(e.data.nodes[i]['id']));
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
            w = new Worker("workers/pagerankComputing.js");
            w.postMessage(graphWork);
            w.onmessage = function (e) {
                let nodes = e.data.nodes.length;
            
            
                for (let i = 0; i < nodes; ++i) {
                    
                    //arrotondo i pesi cosi da avere solo 10 differenti pesi 
                    let temp = parseFloat(e.data.nodes[i]['weight']);
                    pixiGraph.pixiNodes[graph.nodes[i]['id']].setWeight(temp);

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
//compute zoom render
function computeTextureZoom(xstart,ystart,xfinish,yfinish,graph,pixiGraph,scalare = 1,containerRoot,fattoreDiScala,raggio,sigma,high,wid,maxVal,colorScalePalette,threshold,rangeFiledComp,edgeThickness){   
    
    containerRootZoom.cacheAsBitmap = false;
    edgesContainerZoom.removeChildren();

    let t1Draw = performance.now();
    let links = graph.edges.length;
    let pointZero = new PIXI.Point(0,0);
    let sigmaMod = sigma;
    let levelsNumber = 11;
    let raggioScalato = fattoreDiScala*sigmaMod*raggio;
    let area = Math.round(raggioScalato*3)

    let indici = [];
    nodes = graph.nodes.length;

    let minxyzoom  = {};
    minxyzoom.x = 350;
    minxyzoom.y = 350;
    minxyzoom.dist = Math.sqrt(Math.pow(350,2)+Math.pow(350,2));;

    //selection of nodes inside the zoom view to render
    for(let i = 0; i<nodes;i++){

        let temp = pixiGraph.pixiNodes[graph.nodes[i]['id']];
        let id = pixiGraph.pixiNodes[graph.nodes[i]['id']].id;

        let xx = Math.round(temp.x-xstart);
        let yy = Math.round(temp.y-ystart);

        //setto inizialmente tutti i cluster dei vari nodi su loro stessi 
        //per poi modificarli se sono presenti nella schermata 
        pixiGraph.pixiNodes[graph.nodes[i]['id']].setPixel(xx,yy);  
        pixiGraph.pixiNodes[graph.nodes[i]['id']].setXY(xx,yy);

        if(( xx>(-(area)) && xx<(high+Math.abs(high - wid)+area))){
            if(( yy>(-(area)) && yy<(wid+Math.abs(high - wid)+area))){
                let distaOrig = Math.sqrt(Math.pow(xx,2)+Math.pow(yy,2));
                

                if(distaOrig<minxyzoom.dist){
                    minxyzoom.x = xx;
                    minxyzoom.y = yy;
                    minxyzoom.dist = distaOrig;
                }
                indici.push(graph.nodes[i]['id']);
                
            }
        }

    } 
    //pre compute of gaussian area 
    let matrixPreCompute = [];
    for(let i = 0; i<=(area);i++){
        matrixPreCompute[i]= [];
        for(let j = 0; j<=(area);j++){  
            matrixPreCompute[i][j] = gasuKern(raggioScalato,raggioScalato,j,i,sigmaMod,fattoreDiScala);
        }
    }

    //compute of density field
    let mat = createMatOutZoom(pixiGraph,wid,high,indici,matrixPreCompute,raggioScalato,maxVal,zoomIntens,minxyzoom);         
    //compute of cluster 
    clusterComputeZoom(pixiGraph,wid,high,indici,rangeFiledComp,mat,zoomIntens,minxyzoom);       
    //compute of aggregate edges
    edgeComputeZoom(xstart,ystart,xfinish,yfinish,pixiGraph,links,graph,edgesContainerZoom,threshold,edgeThickness);
    
    let t2Edge = performance.now();
    console.log("Time needed to compute edges: "  + (t2Edge - t1Draw) + " milliseconds.");

    if(maxVal.value>0){
        let scale = generateColorScale(maxVal,levelsNumber,sigmaMod,raggio);
        //compute of colored texture
        let buff = colorScreen((app.view.height),(app.view.width),mat,scale,colorScalePalette);
        //display texture by pixi sprite
        texture = PIXI.Texture.fromBuffer(buff, (app.view.width), (app.view.height));
        sprite = PIXI.Sprite.from(texture);
        containerRootZoom.addChild(sprite);
    }else{
        maxVal.value = 1;
        let scale = generateColorScale(maxVal,11,sigmaMod,raggio);
        //compute of colored texture
        let buff = colorScreen((app.view.height),(app.view.width),mat,scale,colorScalePalette);
        //display texture by pixi sprite
        texture = PIXI.Texture.fromBuffer(buff, (app.view.width), (app.view.height));
        sprite = PIXI.Sprite.from(texture);
        containerRootZoom.addChild(sprite);
    }

    let t2Draw = performance.now();
    
    console.log("Time needed to draw: "  + (t2Draw - t1Draw) + " milliseconds.");
    containerRootZoom.cacheAsBitmap = true;

    for(let i = 0; i<nodes;i++){

        let temp = pixiGraph.pixiNodes[graph.nodes[i]['id']];
        let id = pixiGraph.pixiNodes[graph.nodes[i]['id']].id;

        let xx = Math.round(temp.x+xstart);
        let yy = Math.round(temp.y+ystart);

        pixiGraph.pixiNodes[graph.nodes[i]['id']].setPixel(xx,yy);  
        pixiGraph.pixiNodes[graph.nodes[i]['id']].setXY(xx,yy);
    
    } 

}
//compute viewport render
function computeTexture(graph,pixiGraph,scalare = 1,containerRoot,fattoreDiScala,raggio,sigma,high,wid,maxVal,colorScalePalette,threshold,rangeFiledComp,edgeThickness){   
    
    containerRoot.cacheAsBitmap = false;
    edgesContainer.removeChildren();

    let t1Draw = performance.now();
    let links = graph.edges.length;
    let pointZero = new PIXI.Point(0,0);
    let sigmaMod = sigma;
    let levelsNumber = 11;
    let raggioScalato = fattoreDiScala*sigmaMod*raggio;
    let area = Math.round(Math.max(high,wid)/2);
    let indici = [];
    nodes = graph.nodes.length;

    //selection of nodes inside de view to render
    for(let i = 0; i<nodes;i++){

        let temp = pixiGraph.pixiNodes[graph.nodes[i]['id']].pixiNode.toGlobal(pointZero);
        let id = pixiGraph.pixiNodes[graph.nodes[i]['id']].id;
        
        let xx = Math.round(temp.x);
        let yy = Math.round(temp.y);
        //setto inizialmente tutti i cluster dei vari nodi su loro stessi 
        //per poi modificarli se sono presenti nella schermata 
        pixiGraph.pixiNodes[graph.nodes[i]['id']].setPixel(xx,yy);  

        pixiGraph.pixiNodes[graph.nodes[i]['id']].setXY(xx,yy);
        //prendo in considerazione solo i nodi che sono dentro la finestra e quelli al di fuori al massimo di 100 px 
        if(( xx>(-(area)) && xx<(high+Math.abs(high - wid)+area))){
            if(( yy>(-(area)) && yy<(wid+Math.abs(high - wid)+area))){
                indici.push(graph.nodes[i]['id']);
                }
        }
        
    } 

    //pre compute of gaussian area 
    let matrixPreCompute = [];
    for(let i = 0; i<=(area);i++){
        matrixPreCompute[i]= [];
        for(let j = 0; j<=(area);j++){  
            matrixPreCompute[i][j] = gasuKern(raggioScalato,raggioScalato,j,i,sigmaMod);
        }
    }

    //compute of density field
    let mat = createMatOut(pixiGraph,wid,high,indici,matrixPreCompute,raggioScalato,maxVal);
    //compute of cluster 
    clusterCompute(pixiGraph,wid,high,indici,rangeFiledComp,mat);
    //compute of aggregate edges
    edgeCompute(area,wid,high,pixiGraph,links,graph,edgesContainer,threshold,edgeThickness);

    let t2Edge = performance.now();

    console.log("Time needed to compute edges: "  + (t2Edge - t1Draw) + " milliseconds.");
    

    
    if(maxVal.value>0){
        let scale = generateColorScale(maxVal,levelsNumber,sigmaMod,raggio);
        //compute of colored texture
        let buff = colorScreen((app.view.height),(app.view.width),mat,scale,colorScalePalette);
        //display texture by pixi sprite
        texture = PIXI.Texture.fromBuffer(buff, (app.view.width), (app.view.height));
        sprite = PIXI.Sprite.from(texture);
        containerRoot.addChild(sprite);
    }else{
        maxVal.value = 1;
        let scale = generateColorScale(maxVal,11,sigmaMod,raggio);
        //compute of colored texture
        let buff = colorScreen((app.view.height),(app.view.width),mat,scale,colorScalePalette);
        //display texture by pixi sprite
        texture = PIXI.Texture.fromBuffer(buff, (app.view.width), (app.view.height));
        sprite = PIXI.Sprite.from(texture);
        containerRoot.addChild(sprite);
    }

    let t2Draw = performance.now();
    
    console.log("Time needed to draw: "  + (t2Draw - t1Draw) + " milliseconds.");

    mat = {};
    scale = {};
    buff =  {};
    texture = {};

    containerRoot.cacheAsBitmap = true;
}
//reset all the parameters
function resetParameters(){

    //reset of graph values and pixi containers
    pixiGraph = new graphClass("Primo");

    graph.nodes.length = 0;
    graph.edges.length = 0;
    //viewport reset
    viewport.removeChildren();
    viewport.scaled = 1;
    viewport.center = {x: 600, y: 400};
    //container reset
    containerRoot.cacheAsBitmap = false;
    containerRootZoom.cacheAsBitmap = false;
    containerRoot.removeChildren();
    edgesContainer.removeChildren();
    edgesContainerZoom.removeChildren();
    containerRootZoom.removeChildren();

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