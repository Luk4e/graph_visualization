'use strict';
// VARIABLES INITIALIZATION
const testPerformance = false;
//declaration of graph struct and pixiGraph struct
const graph = { "nodes": new Array(), "edges": new Array() };
var pixiGraph = new graphClass("Primo");
const nodesDegree = new Map();
var labelsList = new Map();

if(testPerformance){
    console.log = () => {};
}
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


    //global constant value
const fattoreDiScala = 10;
const raggio = 4;
var sigma  = 0.5;
var maxVal = {"value":0};//global maxvalue
let labelTemp;

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


//slider variables 
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


//variable for zoom and labels button 
var position ={};
var buttonActivation = {"zoomActivation":false,"labelsActivation":false}


var mousedowncontroll = false;

document.getElementById("magnifying").style.visibility = 'hidden';


//pixi container for node and edges
let edgesContainer = new PIXI.Container();
let containerRoot = new PIXI.Container();
let containerLabels = new PIXI.Container();

//zoom
let containerRootZoom = new PIXI.Container();
let edgesContainerZoom = new PIXI.Container();

//FAA for view of node and edges
const blurFilter1 = new PIXI.filters.FXAAFilter();
containerRoot.filters = [blurFilter1];
edgesContainer.filters = [blurFilter1];
//zoom
containerRootZoom.filters = [blurFilter1];
edgesContainerZoom.filters = [blurFilter1];


//for zoom in and out without scrolling page
document.getElementById('graph').onwheel = () => false ;

fpsInitialize();

var inputs = document.querySelectorAll('.inputfile');
Array.prototype.forEach.call(inputs, function showName(input) {

    var labelVal = document.getElementById('graphInsert').innerHTML;

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


//Bind PIXI App canvas to element on page 
document.getElementById('magnifying').appendChild(app2.view);
document.getElementById('graph').appendChild(app.view);

//inizialization viewport for pan and zoom 
const viewport = new pixi_viewport.Viewport({
    screenWidth: wid,
    screenHeight: high,
    worldWidth: wid,
    worldHeight: high,
    interaction: app.renderer.plugins.interaction // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
})


//slider
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
    computeTexture(graph,pixiGraph,viewport.scaled,containerRoot,edgesContainer,fattoreDiScala,raggio,sigma,high,wid,maxVal,scalaBluRGBRigirata,thresholdComp,rangeFiledComp,edgeThickness)
}
sliderThresholdAlpha.oninput  = function() {
    thresholdComp = this.value/100;
    outputThresholdAlpha.innerHTML = thresholdComp;
    computeTexture(graph,pixiGraph,viewport.scaled,containerRoot,edgesContainer,fattoreDiScala,raggio,sigma,high,wid,maxVal,scalaBluRGBRigirata,thresholdComp,rangeFiledComp,edgeThickness)

}
sliderRangeField.oninput  = function() {
    rangeFiledComp = Math.round(this.value/10);
    outputSliderRangeField.innerHTML = rangeFiledComp;
    computeTexture(graph,pixiGraph,viewport.scaled,containerRoot,edgesContainer,fattoreDiScala,raggio,sigma,high,wid,maxVal,scalaBluRGBRigirata,thresholdComp,rangeFiledComp,edgeThickness)

}
sliderMaxEdgeThickness.oninput  = function() {
    edgeThickness = Math.round(this.value/10);
    outputSliderMaxEdgeThickness.innerHTML = Math.round(this.value/10);
    computeTexture(graph,pixiGraph,viewport.scaled,containerRoot,edgesContainer,fattoreDiScala,raggio,sigma,high,wid,maxVal,scalaBluRGBRigirata,thresholdComp,rangeFiledComp,edgeThickness)

}
sliderZoomIntensity.oninput  = function() {
    zoomIntens = this.value;
    outputSliderZoomIntensity.innerHTML = this.value;

}
//end of sidebar part


//Pixiviewport of the main view space to manage pan and zoom in and out
viewport
    .drag()
    .wheel({percent:0.1})
    .on('wheel', function(){
        computeTexture(graph,pixiGraph,viewport.scaled,containerRoot,edgesContainer,fattoreDiScala,raggio,sigma,high,wid,maxVal,scalaBluRGBRigirata,thresholdComp,rangeFiledComp,edgeThickness)
    })
    .on('moved', function(){
        computeTexture(graph,pixiGraph,viewport.scaled,containerRoot,edgesContainer,fattoreDiScala,raggio,sigma,high,wid,maxVal,scalaBluRGBRigirata,thresholdComp,rangeFiledComp,edgeThickness)
    }) 

//button label actions
function searchLabel(){
   
    if(!buttonActivation.labelsActivation){
        buttonActivation.labelsActivation = true;
        viewport.pause = true;
        labelsView(containerLabels,labelsList,position.xstart,position.ystart,graph,pixiGraph);
    }else{
        buttonActivation.labelsActivation = false;
        viewport.pause = false;
        containerLabels.removeChildren();
      }
}
//button zoom actions
function changestatuszoom(){

    if(!buttonActivation.zoomActivation){
        document.getElementById("magnifying").style.visibility = 'visible';
        buttonActivation.zoomActivation = true;
        viewport.pause = true;
        document.body.style.cursor = "crosshair"
    }else{
        document.getElementById("magnifying").style.visibility = 'hidden';
        viewport.pause = false;
        buttonActivation.zoomActivation = false;
        document.body.style.cursor = "default"
        containerRootZoom.removeChildren();
        edgesContainerZoom.removeChildren();
        containerRootZoom.cacheAsBitmap = false;
    }
}
//mouse event listener for discover mouse position to compute zoom in a specific area

document.getElementById("graph").addEventListener("mousedown", function() {
    mousedowncontroll = true;
    
});

document.getElementById("graph").addEventListener("mousemove", function(){
    if(mousedowncontroll){
        if(buttonActivation.zoomActivation && !buttonActivation.labelsActivation){

            let e = window.event;
            let rect = e.target.getBoundingClientRect();

            position.xstart = e.clientX-rect.left;
            position.ystart = e.clientY-rect.top; 

            position.xstart -= Math.ceil((200)/(zoomIntens));
            position.ystart -= Math.ceil((200)/(zoomIntens));

            position.xend = position.xstart;
            position.yend = position.ystart;


            computeTextureZoom(position.xstart,position.ystart,position.xend,position.yend,graph,pixiGraph,viewport.scaled,containerRootZoom,edgesContainerZoom,fattoreDiScala,raggio,sigma,high,wid,maxVal,scalaBluRGBRigirata,thresholdComp,rangeFiledComp,edgeThickness);
        }
    }

});

document.getElementById("graph").addEventListener("mouseup", function() {
    mousedowncontroll = false;
});


//extrapolation of data from file
document.getElementById('file').onchange = function () {
    
    execPageRank = document.getElementById('computePageRankCheckbox').checked;
    layoutComputCheck = document.getElementById('computeLayoutCheckbox').checked;
    let loadingDataStart = performance.now()

    if (graph.nodes.length != 0) {
        resetParameters();
    }

    let file = this.files[0];
    let reader = new FileReader();
    let nodeTemp = new Array();
    let tempSet  = new Set();
    let edgeSet  = new Set();
 
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

                    let circle = new Graphics();

                    circle.x = xSourceNode;
                    circle.y = ySourceNode;
                    

                    viewport.addChild(circle);
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
                        graph.nodes.push(nodeTemp[target]);
                    }
                    //check to draw edges, from a to b and from b to a, only one time like a undirected graph
                    if(!edgeSet.has(""+sourceNode+target) && !edgeSet.has(""+target+sourceNode)){
                        graph.edges.push({ "source": nodeTemp[sourceNode], "target": nodeTemp[target]});
                        edgeSet.add(""+sourceNode+target);
                    }
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

                        let circle = new Graphics();

                        circle.x = xSource;
                        circle.y = ySource;
                        

                        viewport.addChild(circle);
                        let nodeIns = new NodeClass(source,circle,circle.x,circle.y,1,1);

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

                        let circle = new Graphics();

                        circle.x = xTarget;
                        circle.y = yTarget;
                        
                        viewport.addChild(circle);
                        let nodeIns = new NodeClass(target,circle,circle.x,circle.y,1,1);

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
        edgeSet.clear();
        tempSet.clear();

        nodeTemp = null;

        let loadingDataEnd = performance.now()
        console.log("caricamento dati tempo : "+(loadingDataEnd-loadingDataStart));
        console.log("dati letti ");

        drawGraph(graph,pixiGraph,viewport,document);


    };
    
    reader.readAsText(file)
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

    computeTexture(graph,pixiGraph,viewport.scaled,containerRoot,edgesContainer,fattoreDiScala,raggio,sigma,high,wid,maxVal,scalaBluRGBRigirata,thresholdComp,rangeFiledComp,edgeThickness);

    app.stage.addChild(containerRoot);
    app.stage.addChild(viewport);
    app.stage.addChild(edgesContainer);
    app.stage.addChild(containerLabels);
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

        let ww = new Worker("workers/greadabilityWorker.js");
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
            let w = new Worker("workers/layoutComputingWorker.js");
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

                        let nodeIns = new NodeClass(e.data.nodes[i]['id'],circle,circle.x,circle.y,1,nodesDegree.get(e.data.nodes[i]['id']));
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
                        
                        let nodeIns = new NodeClass(e.data.nodes[i]['id'],circle,circle.x,circle.y,1,nodesDegree.get(e.data.nodes[i]['id']));
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
            let w = new Worker("workers/pagerankComputing.js");
            w.postMessage(graphWork);
            w.onmessage = function (e) {
                let nodes = e.data.nodes.length;
            
                for (let i = 0; i < nodes; ++i) {                    
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
//reset all the parameters
function resetParameters(){

    //reset of graph values and pixi containers
    pixiGraph = new graphClass("Primo");
    nodesDegree.clear();
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
//Fps monitorining system 
function fpsInitialize(){

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

}