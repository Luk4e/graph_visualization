

    //pixi create edges and nodes function()
    //function that compute the gaussian 2d from a node to one point on the screen
    function gasuKern(x,y,xi,yi,sigma,valueForScaling=10,weightNode=1){

        let xNum     = (x - xi)/(valueForScaling*weightNode);
        let yNum     = (y - yi)/(valueForScaling*weightNode);
        let first    = 1/(2*Math.PI*Math.pow(sigma,2)*Math.pow((valueForScaling*weightNode),2));
        let num      = Math.pow(xNum,2)+Math.pow(yNum,2);
        let den      = Math.pow(sigma,2);
        let third    = Math.exp(-0.5*(num/den));

        return first*third;

    }
    //function that use the scale to map the pixel on the colors scale 
    function colorScreen(row,col,matrix,scale,colorScale,alpha=255,startX=0,startY=0){

        let buf = new Uint8Array(col * row * 4)
        let temp;

        for(let i=startX; i<row; i++) {
            for(let j=startY; j<col; j++) {
                temp = matrix[i][j];
                //console.log(temp)
                
                if(temp<scale[10]){
                    buf[((i*col) + j )* 4]     = colorScale[10][0];
                    buf[((i*col) + j )* 4 + 1] = colorScale[10][1];
                    buf[((i*col) + j )* 4 + 2] = colorScale[10][2];
                    buf[((i*col) + j )* 4 + 3] = alpha; 
                }else if (temp>=scale[1]){    
                    //console.log('uno');
                    buf[((i*col) + j )* 4]     = colorScale[9][0];
                    buf[((i*col) + j )* 4 + 1] = colorScale[9][1];
                    buf[((i*col) + j )* 4 + 2] = colorScale[9][2];
                    buf[((i*col) + j )* 4 + 3] = alpha; 

                }else if (temp>=scale[2] && temp<scale[1]){
                    //console.log('due');
                    buf[((i*col) + j )* 4]     = colorScale[8][0];
                    buf[((i*col) + j )* 4 + 1] = colorScale[8][1];
                    buf[((i*col) + j )* 4 + 2] = colorScale[8][2];
                    buf[((i*col) + j )* 4 + 3] = alpha; 

                }else if (temp>=scale[3] && temp<scale[2]){
                    //console.log('tre');
                    buf[((i*col) + j )* 4]     = colorScale[7][0];
                    buf[((i*col) + j )* 4 + 1] = colorScale[7][1];
                    buf[((i*col) + j )* 4 + 2] = colorScale[7][2];
                    buf[((i*col) + j )* 4 + 3] = alpha; 

                }else if (temp>=scale[4] && temp<scale[3]){
                    //console.log('quattro');

                    buf[((i*col) + j )* 4]     = colorScale[6][0];
                    buf[((i*col) + j )* 4 + 1] = colorScale[6][1];
                    buf[((i*col) + j )* 4 + 2] = colorScale[6][2];
                    buf[((i*col) + j )* 4 + 3] = alpha; 

                }else if (temp>=scale[5] && temp<scale[4]){
                    //console.log('cinque');
                    buf[((i*col) + j )* 4]     = colorScale[5][0];
                    buf[((i*col) + j )* 4 + 1] = colorScale[5][1];
                    buf[((i*col) + j )* 4 + 2] = colorScale[5][2];
                    buf[((i*col) + j )* 4 + 3] = alpha; 

                }else if (temp>=scale[6] && temp<scale[5]){
                    //console.log('sei');

                    buf[((i*col) + j )* 4]     = colorScale[4][0];
                    buf[((i*col) + j )* 4 + 1] = colorScale[4][1];
                    buf[((i*col) + j )* 4 + 2] = colorScale[4][2];
                    buf[((i*col) + j )* 4 + 3] = alpha; 

                }else if (temp>=scale[7] && temp<scale[6]){
                    //console.log('sette');
                    buf[((i*col) + j )* 4]     = colorScale[3][0];
                    buf[((i*col) + j )* 4 + 1] = colorScale[3][1];
                    buf[((i*col) + j )* 4 + 2] = colorScale[3][2];
                    buf[((i*col) + j )* 4 + 3] = alpha; 

                }else if (temp>=scale[8] && temp<scale[7]){
                    //console.log('otto');
                    buf[((i*col) + j )* 4]     = colorScale[2][0];
                    buf[((i*col) + j )* 4 + 1] = colorScale[2][1];
                    buf[((i*col) + j )* 4 + 2] = colorScale[2][2];
                    buf[((i*col) + j )* 4 + 3] = alpha; 

                }else if (temp>=scale[9] && temp<scale[8]){
                    //console.log('nove');
                    buf[((i*col) + j )* 4]     = colorScale[1][0];
                    buf[((i*col) + j )* 4 + 1] = colorScale[1][1];
                    buf[((i*col) + j )* 4 + 2] = colorScale[1][2];
                    buf[((i*col) + j )* 4 + 3] = alpha; 

                }else if (temp>scale[10] && temp<scale[9]){
                    //console.log('dieci');
                    buf[((i*col) + j )* 4]     = colorScale[0][0];
                    buf[((i*col) + j )* 4 + 1] = colorScale[0][1];
                    buf[((i*col) + j )* 4 + 2] = colorScale[0][2];
                    buf[((i*col) + j )* 4 + 3] = alpha; 

                }
            }
        }

        return buf;
    }
    //function that create the scale for the colors 
    function generateColorScale(maxValue,levelsNumber=10,sigma=1,r){

        let xstep   = (sigma*r)/levelsNumber;
        let xlevel  = new Float64Array(levelsNumber);

        //mi creo la mia scala che va da 0 a sigma per il raggio 
        for(let j = 0; j<levelsNumber;j++){ 
            xlevel[j] = j*xstep;
        }

        
        //uso la scala creata e vado a mapparla sulle y cosi da avere i valori per creare la scala finale
        let gaussianScale = gaussian1D(xlevel,sigma);

        
        //utilizzo il massimo valore per portare la scala sui miei valori 
        for(let i = 0; i < levelsNumber;i++){
            xlevel[i] = (gaussianScale[i]/gaussianScale[0])*maxValue.value;
        }

        
        return xlevel;            

    }
    //function that calculate the y value for an x of the gaussian 1d
    function gaussian1D(x,sigma=1,mu=0){

        let first   = 1/(2*Math.PI*Math.pow(sigma,2));
        let den     = Math.pow(sigma,2);
        let num     = 0;
        let second  = 0;
        let res     = 0;

        if(x.length>1){
            res  = new Float64Array(x.length);
            for(let i = 0; i<x.length;i++){
                num         = Math.pow((x[i]-mu),2);
                second      = Math.exp(-0.5*(num/den));
                res[i]      = first*second;
            }
        }else{
            first       = 1/(2*Math.PI*Math.pow(sigma,2));
            num         = Math.pow((x-mu),2);
            second      = Math.exp(-0.5*(num/den));
            res         = first*second;
        }
        return res;

    }

    function clusterCompute(pixiGraph,wid,high,vecXY,rangeField=1,precomputedMatrix){
       
        
        let xDa;
        let xA;
        let yDa;
        let yA;
        let temp;
        let xTemp;
        let yTemp;
        let tempCheck;
        let control;

        let lengthVec = vecXY.length;

        for(let i = 0; i<lengthVec;i++){
            control = true;
            xTemp = pixiGraph.pixiNodes[vecXY[i]].x;
            yTemp = pixiGraph.pixiNodes[vecXY[i]].y;

            
            temp = 0;

            while(control){
                
                xDa = Math.max(Math.round(xTemp-rangeField),0);
                xA  = Math.min(Math.round(xTemp+rangeField),(wid-1));
                yDa = Math.max(Math.round(yTemp-rangeField),0);
                yA  = Math.min(Math.round(yTemp+rangeField),(high-1));
                tempCheck = temp;
                for(let k = yDa;k<=yA;k++){
                    for(let j = xDa;j<=xA;j++){  
                        if(temp<precomputedMatrix[k][j]){
                            temp = precomputedMatrix[k][j];
                            xTemp = j;
                            yTemp = k;
                        }
                    }
                }
                if(tempCheck==temp){ 
                    control = false;
                }
            }
           
            
            pixiGraph.pixiNodes[vecXY[i]].setPixel(xTemp,yTemp);
            pixiGraph.pixiNodes[vecXY[i]].setClusterValue(temp)
        }

    }

    function edgeCompute(area,wid,high,pixiGraph,links,graph,edgesContainer,thresholdAlpha,maxEdgeThickness){
        "use strict";
        edgesContainerZoom.removeChildren();

        let edgeIdx = {};
        let maxEdgeAgg = 1;

        for (let i = 0; i < links; ++i) {

            let sour = pixiGraph.getNodeById(graph.edges[i]['source'].id);
            let targ = pixiGraph.getNodeById(graph.edges[i]['target'].id);

            if(( sour.x>(-(area)) && sour.x<(high+Math.abs(high - wid)+area))){
                if(( sour.y>(-(area)) && sour.y<(wid+Math.abs(high - wid)+area))){

                    if(( targ.x>(-(area)) && targ.x<(high+Math.abs(high - wid)+area))){
                        if(( targ.y>(-(area)) && targ.y<(wid+Math.abs(high - wid)+area))){

                            let sourCluster = ""+sour.xCluster+"-"+sour.yCluster;
                            let targCluster = ""+targ.xCluster+"-"+targ.yCluster;
                            //if((sour.cluster) != (targ.cluster)){
                            if(sourCluster != targCluster){
                
                                //let idClusterEdge = ""+sour.cluster+targ.cluster;
                                let idClusterEdge = ""+sourCluster+"-"+targCluster;
                
                                if(edgeIdx[idClusterEdge]){
                                    edgeIdx[idClusterEdge][4] += 1;
                                    if(maxEdgeAgg<edgeIdx[idClusterEdge][4]){
                                        maxEdgeAgg = edgeIdx[idClusterEdge][4];
                                    }
                                }else{
                                    edgeIdx[idClusterEdge] = [];
                                    edgeIdx[idClusterEdge].push(sour.xCluster);
                                    edgeIdx[idClusterEdge].push(sour.yCluster);
                                    edgeIdx[idClusterEdge].push(targ.xCluster);
                                    edgeIdx[idClusterEdge].push(targ.yCluster);
                                    edgeIdx[idClusterEdge].push(1);
                                }
                            }  
                     
                        }
                    }
                }
            }
        }
        let scaling = maxEdgeAgg/maxEdgeThickness;

        //TODO:
        //aumentare valore della soglia di alpha avvicinandomi e diminuirlo allontanandomi
        //oppure diminuire valore di alpha di tutti gli archi di un certo tot e aumentarlo fino ad arrivare a uno indietreggiando
        //oppure
        //aumentare valore di sigma avvicinandomi 
        //diminuirlo allontandomi 

/* 
        for(let key in edgeIdx){            
            let alphaEdge = (edgeIdx[key][4]/maxEdgeAgg)>0.2? (edgeIdx[key][4]/maxEdgeAgg)-0.1:(edgeIdx[key][4]/maxEdgeAgg)+0.05;
            //let alphaEdge = (edgeIdx[key][4]/maxEdgeAgg);

            if(edgeIdx[key][4]>maxEdgeThickness){
                edgeIdx[key][4]=maxEdgeThickness
            }
            if(alphaEdge>=thresholdAlpha ){
                let line = new PIXI.Graphics();
                //line.beginFill(0xFFFFFF,1);
                //line.lineStyle(Math.ceil((edgeIdx[key][4])) , 0xFFA500, alphaEdge);//other colors:0xFFA500,
                line.lineStyle(Math.ceil((edgeIdx[key][4]/scaling)) , 0xFFA500, alphaEdge);//other colors:0xFFA500,
                line.moveTo(edgeIdx[key][0], edgeIdx[key][1]);
                line.lineTo(edgeIdx[key][2], edgeIdx[key][3]);
                edgesContainer.addChild(line);
            }
        } */



        for(let key in edgeIdx){            
            let alphaEdge = (edgeIdx[key][4]/maxEdgeAgg)>0.2 ? (edgeIdx[key][4]/maxEdgeAgg)-0.1 : (edgeIdx[key][4]/maxEdgeAgg)+0.05;
            
            if(maxEdgeAgg>maxEdgeThickness){
                edgeIdx[key][4]=(edgeIdx[key][4]/maxEdgeAgg)*maxEdgeThickness
            } 
            
            if(alphaEdge>=thresholdAlpha ){
                let line = new PIXI.Graphics();
                //line.beginFill(0xFFFFFF,1);
                line.lineStyle(Math.ceil((edgeIdx[key][4])) , 0xFFA500, alphaEdge);//other colors:0xFFA500,
                line.moveTo(edgeIdx[key][0], edgeIdx[key][1]);
                line.lineTo(edgeIdx[key][2], edgeIdx[key][3]);
                edgesContainer.addChild(line);
            }
        }
    }
    
    function clusterComputeZoom(pixiGraph,wid,high,vecXY,rangeField=1,precomputedMatrix,scaleZoom=1,origin){
  
        
        let xDa;
        let xA;
        let yDa;
        let yA;
        let temp;
        let xTemp;
        let yTemp;
        let tempCheck;
        let control;

        let lengthVec = vecXY.length;

        for(let i = 0; i<lengthVec;i++){
            control = true;
            xTemp = pixiGraph.pixiNodes[vecXY[i]].x;
            yTemp = pixiGraph.pixiNodes[vecXY[i]].y;
            //console.log(yTemp);

            xTemp = (xTemp*scaleZoom) - (Math.abs(origin.x))
            yTemp = (yTemp*scaleZoom) - (Math.abs(origin.y))

           
            temp = 0;

            while(control){
                
                xDa = Math.max(Math.round(xTemp-rangeField),0);
                xA  = Math.min(Math.round(xTemp+rangeField),(wid-1));
                yDa = Math.max(Math.round(yTemp-rangeField),0);
                yA  = Math.min(Math.round(yTemp+rangeField),(high-1));
                tempCheck = temp;
                for(let k = yDa;k<=yA;k++){
                    for(let j = xDa;j<=xA;j++){  
                        if(temp<precomputedMatrix[k][j]){
                            temp = precomputedMatrix[k][j];
                            xTemp = j;
                            yTemp = k;
                        }
                    }
                }
                if(tempCheck==temp){ 
                    control = false;
                }
            }
           
            pixiGraph.pixiNodes[vecXY[i]].setPixel(xTemp,yTemp);

        }

    }

    function edgeComputeZoom(xstart,ystart,xstop,ystop,pixiGraph,links,graph,edgesContainerZoom,thresholdAlpha,maxEdgeThickness){ 
        "use strict";
        edgesContainerZoom.removeChildren();


        let edgeIdx = {};
        let maxEdgeAgg = 1;

        for (let i = 0; i < links; ++i) {

            let sour = pixiGraph.getNodeById(graph.edges[i]['source'].id);
            let targ = pixiGraph.getNodeById(graph.edges[i]['target'].id);

            let sourCluster = ""+sour.xCluster+"-"+sour.yCluster;
            let targCluster = ""+targ.xCluster+"-"+targ.yCluster;
            //if((sour.cluster) != (targ.cluster)){
            if(sourCluster != targCluster){

                //let idClusterEdge = ""+sour.cluster+targ.cluster;
                let idClusterEdge = ""+sourCluster+"-"+targCluster;

                if(edgeIdx[idClusterEdge]){
                    edgeIdx[idClusterEdge][4] += 1;
                    if(maxEdgeAgg<edgeIdx[idClusterEdge][4]){
                        maxEdgeAgg = edgeIdx[idClusterEdge][4];
                    }
                }else{
                    edgeIdx[idClusterEdge] = [];
                    edgeIdx[idClusterEdge].push(sour.xCluster);
                    edgeIdx[idClusterEdge].push(sour.yCluster);
                    edgeIdx[idClusterEdge].push(targ.xCluster);
                    edgeIdx[idClusterEdge].push(targ.yCluster);
                    edgeIdx[idClusterEdge].push(1);
                }
            }  
            
            
        }
        //let scaling = maxEdgeAgg/maxEdgeThickness;
        
        for(let key in edgeIdx){            
            let alphaEdge = (edgeIdx[key][4]/maxEdgeAgg)>0.2? (edgeIdx[key][4]/maxEdgeAgg)-0.1:(edgeIdx[key][4]/maxEdgeAgg)+0.05;
            
            if(maxEdgeAgg>maxEdgeThickness){
                edgeIdx[key][4]=(edgeIdx[key][4]/maxEdgeAgg)*maxEdgeThickness
            } 

            if(alphaEdge>=thresholdAlpha ){
                let line = new PIXI.Graphics();
                //line.beginFill(0xFFFFFF,1);
                line.lineStyle(Math.ceil((edgeIdx[key][4])) , 0xFFA500, alphaEdge);
                line.moveTo(edgeIdx[key][0], edgeIdx[key][1]);
                line.lineTo(edgeIdx[key][2], edgeIdx[key][3]);
                edgesContainerZoom.addChild(line);
            }
        }
    }

    function createMatOut(pixiGraph,wid,high,vecXY,precomputedMatrix,rag,maxValueObj){
        "use strict";
 
        let xOfNode;
        let yOfNode;
        let maxxi = 0;
        //let temp;
        let xDa;
        let xA;
        let yDa;
        let yA;
        let w;
        let p;
        let weightOfNode;
        
        let emptyMatrix = [];
        for(let i = 0;i<high;i++){
            emptyMatrix[i]=[]
            for(let j = 0;j<wid;j++){
                emptyMatrix[i][j]= 0;
            }
        }

        let lengthVec = vecXY.length;

        for(let i = 0; i<lengthVec;i++){

            xOfNode = pixiGraph.pixiNodes[vecXY[i]].x;
            yOfNode = pixiGraph.pixiNodes[vecXY[i]].y;

            weightOfNode = pixiGraph.pixiNodes[vecXY[i]].weight;
            //console.log(weightOfNode)
            xDa = Math.max(Math.round(xOfNode-rag),0);
            xA  = Math.min(Math.round(xOfNode+rag),(wid-1));
            yDa = Math.max(Math.round(yOfNode-rag),0);
            yA  = Math.min(Math.round(yOfNode+rag),(high-1));

            w = Math.max(Math.round(rag-yOfNode),0);
        
            for(let k = yDa;k<=yA;k++){
                p = Math.max(Math.round(rag-xOfNode),0);
                for(let j = xDa;j<=xA;j++){     
                    emptyMatrix[k][j] += (precomputedMatrix[w][p]*weightOfNode);
                    if(emptyMatrix[k][j]>maxxi){
                        maxxi = emptyMatrix[k][j];
                    }
                    p++;
                }
                w++;
            }
            
        }

        maxValueObj.value = maxxi;
        return emptyMatrix;
        
    }

    function createMatOutZoom(pixiGraph,wid,high,vecXY,precomputedMatrix,rag,maxValueObj,scaleZoom=1,origin){

        let xOfNode;
        let yOfNode;
        let maxxi = 0;

        let xDa;
        let xA;
        let yDa;
        let yA;
        let w;
        let p;
        
        let emptyMatrix = [];
        for(let i = 0;i<high;i++){
            emptyMatrix[i]=[]
            for(let j = 0;j<wid;j++){
                emptyMatrix[i][j]= 0;
            }
        }

        let lengthVec = vecXY.length;
        for(let i = 0; i<lengthVec;i++){

            xOfNode = pixiGraph.pixiNodes[vecXY[i]].x;
            yOfNode = pixiGraph.pixiNodes[vecXY[i]].y;

            xOfNode = (xOfNode*scaleZoom) - (Math.abs(origin.x))
            yOfNode = (yOfNode*scaleZoom) - (Math.abs(origin.y))

            weightOfNode = pixiGraph.pixiNodes[vecXY[i]].weight;


            xDa = Math.max(Math.round(xOfNode-rag),0);
            xA  = Math.min(Math.round(xOfNode+rag),(wid-1));
            yDa = Math.max(Math.round(yOfNode-rag),0);
            yA  = Math.min(Math.round(yOfNode+rag),(high-1));
            
            w = Math.max(Math.round(rag-yOfNode),0);
            
            for(let k = yDa;k<=yA;k++){
                p = Math.max(Math.round(rag-xOfNode),0);
                for(let j = xDa;j<=xA;j++){     
                    emptyMatrix[k][j] += (precomputedMatrix[w][p]*weightOfNode);
                    if(emptyMatrix[k][j]>maxxi){
                        maxxi = emptyMatrix[k][j];
                    }
                    p++;
                }
                w++;
            }
        }

        maxValueObj.value = maxxi;
        return emptyMatrix;
        
    }
    //compute viewport render
    function computeTexture(graph,pixiGraph,scalare = 1,containerRoot,edgesContainer,fattoreDiScala,raggio,sigma,high,wid,maxVal,colorScalePalette,threshold,rangeFiledComp,edgeThickness){   
    
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

        let t2DensityFiel = performance.now();

        console.log(`Time needed to compute Density Field: ${(t2DensityFiel - t1Draw)} +  milliseconds.`);

        let t3ClusterStart = performance.now();
        //compute of cluster 
        clusterCompute(pixiGraph,wid,high,indici,rangeFiledComp,mat);
        let t3ClusterEnd = performance.now();

        console.log(`Time needed to compute Cluster: ${(t3ClusterEnd - t3ClusterStart)} milliseconds.`);

        let t4EdgeAggStart = performance.now();
        //compute of aggregate edges
        edgeCompute2(indici,area,wid,high,pixiGraph,links,graph,edgesContainer,threshold,edgeThickness);
        //edgeCompute(area,wid,high,pixiGraph,links,graph,edgesContainer,threshold,edgeThickness);

        let t4EdgeAggEnd = performance.now();

        console.log(`Time needed to compute Edge Agg all: ${(t4EdgeAggEnd - t4EdgeAggStart)} milliseconds.`);


        console.log(`Time needed to compute All : ${(t4EdgeAggEnd - t1Draw)} milliseconds.`);
        

        
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
        
        console.log(`Time needed to draw: ${(t2Draw - t4EdgeAggEnd)} milliseconds.`);

        

        mat = {};   
        scale = {};
        buff =  {};
        texture = {};

        containerRoot.cacheAsBitmap = true;
    }
    //compute zoom render
    function computeTextureZoom(baseTextSize,xstart,ystart,xfinish,yfinish,graph,pixiGraph,scalare = 1,containerRootZoom,edgesContainerZoom,containerLabelsZoom,fattoreDiScala,raggio,sigma,high,wid,maxVal,colorScalePalette,threshold,rangeFiledComp,edgeThickness,buttonActivation,viewport){   
    
        containerRootZoom.cacheAsBitmap = false;
        edgesContainerZoom.removeChildren();
        containerLabelsZoom.removeChildren();

        let t1Draw = performance.now();
        let links = graph.edges.length;
        let pointZero = new PIXI.Point(0,0);
        let sigmaMod = sigma;
        let levelsNumber = 11;
        let raggioScalato = fattoreDiScala*sigmaMod*raggio;
        let area = Math.round(350)
 
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
        console.log(`Time needed to compute edges: ${(t2Edge - t1Draw)} milliseconds.`);

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

        if(buttonActivation.labelsActivation){
            labelsViewZoom(baseTextSize,pixiGraph,high,wid,MAPLABELS,averageDegree,viewport,containerLabelsZoom,GRAPH,buttonActivation);
        }

        console.log(`Time needed to draw: ${(t2Draw - t1Draw)} milliseconds.`);
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

    function labelsView(buttonActivationZoom,labelsOnClick,baseTextSize,containerAdiacentLabels,pixiGraphStruct,high,wid,labelsMap,averageDegree,seeAllLabels,viewport,containerLabels,labelsList,xstart,ystart,graph,maxDistance = 150,numOfLabelsToShowUp=5){   
    
        let nodeOrderByCluster = new Map()
        let maxDegree = 0;
        let pointZero = new PIXI.Point(0,0);
        let count=0;
        let sortedByDegree;
        //let varianceDegree=0;
        let nodeCount=0;
        let minimumDegree = 0;
        let controlLabelAdiacent = {value:false};
        let labelsAlreadyDisplayed = new Set();
        let labelsDisplayedText = new Array();
        
        containerLabels.removeChildren();

        //selection of nodes inside de view to render
        for(let i = 0; i<nodes;i++){
            
            let temp = pixiGraphStruct.pixiNodes[graph.nodes[i]['id']].pixiNode.toGlobal(pointZero);
            
            let xx = temp.x;
            let yy = temp.y;

            if(( xx>(0) && xx<(high+Math.abs(high - wid)))){
                if(( yy>(0) && yy<(wid+Math.abs(high - wid)))){
                    
                    let selectedNode = pixiGraphStruct.pixiNodes[graph.nodes[i]['id']];
                    if(maxDegree<selectedNode.degree){
                        maxDegree=selectedNode.degree;
                    }
                    if(!nodeOrderByCluster.has(selectedNode.clusterName)){
                        let tempObj = {
                            id : selectedNode.id,
                            degree:selectedNode.degree,
                            clusterValue:selectedNode.clusterValue
                        }
                        nodeOrderByCluster.set(selectedNode.clusterName,tempObj);
                    }else{
                        let tempObj = {
                            id : selectedNode.id,
                            degree:selectedNode.degree,
                            clusterValue:selectedNode.clusterValue
                        }
                        if(nodeOrderByCluster.get(selectedNode.clusterName).degree<tempObj.degree){
                            nodeOrderByCluster.set(selectedNode.clusterName,tempObj);
                        }
                    }
                    nodeCount++;
                    //varianceDegree += Math.pow((selectedNode.degree-averageDegree),2);

                    count++;
                }
            }
            
        } 
        //sortedByDegree = new Map([...nodeOrderByCluster.entries()].sort((a, b) => b[1].degree - a[1].degree || b[1].clusterValue - a[1].clusterValue));
        sortedByDegree = new Map([...nodeOrderByCluster.entries()].sort((a, b) => b[1].degree - a[1].degree ));

        //console.log((viewport.lastViewport.scaleX/(60/100))/100);
        //console.log(viewport.lastViewport.scaleX/(60/100));
        //maxDegree = 0;//Math.floor(maxDegree*(1-(viewport.lastViewport.scaleX/(60/100))/100));

        //varianceDegree = Math.ceil((varianceDegree/count)); 
        //console.log("Mean: " + averageDegree + "Variance: "+varianceDegree+" max degree "+maxDegree)

        if(!seeAllLabels){

            count = Math.ceil(count*(viewport.lastViewport.scaleX/(60/100))/100);
            minimumDegree=Math.ceil((maxDegree-(maxDegree*(0.4+(viewport.lastViewport.scaleX/(60/100))/100))));
        }


        for(nodeToDraw of sortedByDegree){
            if(count>0 && (nodeToDraw[1].degree>=minimumDegree)){//nodeToDraw[1].degree>=maxDegree && 
                let circleText;
                let style = {
                    font : 'bold 16px Arial',
                    fill : '#ffffff',
                    stroke : '#000000',
                    strokeThickness : 2,
                }
                let circle = new PIXI.Graphics();
                circle.lineStyle(0);
                circle.beginFill(0xDE3249, 1);
                circle.drawCircle(1, 1, 5);
                circle.x = pixiGraphStruct.pixiNodes[nodeToDraw[1].id].xCluster;
                circle.y = pixiGraphStruct.pixiNodes[nodeToDraw[1].id].yCluster;
                labelsAlreadyDisplayed.add(pixiGraphStruct.pixiNodes[nodeToDraw[1].id].clusterName);
                circle.endFill();
                circle.interactive = true;
                containerLabels.addChild(circle);

                if(labelsMap.size!=0){
                    circleText = new PIXI.Text(labelsMap.get(nodeToDraw[1].id),style);
                }else{
                    circleText = new PIXI.Text(nodeToDraw[1].id,style);
                }

                //circleText.style.fontSize = 16;
                circleText.style.fontSize = (Math.floor((15/maxDegree)*nodeToDraw[1].degree))+baseTextSize;
                circleText.x = pixiGraphStruct.pixiNodes[nodeToDraw[1].id].xCluster;
                circleText.y = pixiGraphStruct.pixiNodes[nodeToDraw[1].id].yCluster;
                circleText.interactive = true;

                circleText.refToId = nodeToDraw[1].id;
                containerLabels.addChild(circleText);
                circleText.on('mouseup',() => {showAdiacentLabels(buttonActivationZoom,labelsOnClick,baseTextSize,controlLabelAdiacent,containerAdiacentLabels,pixiGraphStruct,high,wid,circleText,circle,pointZero,labelsMap,labelsAlreadyDisplayed,maxDegree,containerLabels)});
                circle.on('mouseup',()=>{circleText.visible = !circleText.visible})
                labelsDisplayedText.push(circleText)

                
                count--;
            }
        }

            
        nodeOrderByCluster.clear();
    
        return labelsAlreadyDisplayed;

    }

    function edgeCompute2(vecArr,area,wid,high,pixiGraph,links,graph,edgesContainer,thresholdAlpha,maxEdgeThickness){
        "use strict";
        edgesContainer.removeChildren();

        let edgeIdx = {};
        let maxEdgeAgg = 1;
        let setIndici = new Set(vecArr);
        for (let i = 0; i < links; ++i) {

            let sour = pixiGraph.getNodeById(graph.edges[i]['source'].id);
            let targ = pixiGraph.getNodeById(graph.edges[i]['target'].id);

            if(setIndici.has(graph.edges[i]['source'].id) && setIndici.has(graph.edges[i]['target'].id)){
                let sourCluster = ""+sour.xCluster+"-"+sour.yCluster;
                let targCluster = ""+targ.xCluster+"-"+targ.yCluster;
                //if((sour.cluster) != (targ.cluster)){
                if(sourCluster != targCluster){
    
                    //let idClusterEdge = ""+sour.cluster+targ.cluster;
                    let idClusterEdge = ""+sourCluster+"-"+targCluster;
    
                    if(edgeIdx[idClusterEdge]){
                        edgeIdx[idClusterEdge][4] += 1;
                        if(maxEdgeAgg<edgeIdx[idClusterEdge][4]){
                            maxEdgeAgg = edgeIdx[idClusterEdge][4];
                        }
                    }else{
                        edgeIdx[idClusterEdge] = [];
                        edgeIdx[idClusterEdge].push(sour.xCluster);
                        edgeIdx[idClusterEdge].push(sour.yCluster);
                        edgeIdx[idClusterEdge].push(targ.xCluster);
                        edgeIdx[idClusterEdge].push(targ.yCluster);
                        edgeIdx[idClusterEdge].push(1);
                    }
                } 
            } 
        }
        let x = maxEdgeAgg/maxEdgeThickness;

        for(let key in edgeIdx){            
            let alphaEdge = (edgeIdx[key][4]/maxEdgeAgg)//>0.2 ? (edgeIdx[key][4]/maxEdgeAgg)-0.1 : (edgeIdx[key][4]/maxEdgeAgg)+0.05;
            
            if(maxEdgeAgg>maxEdgeThickness){
                edgeIdx[key][4]=(edgeIdx[key][4]/maxEdgeAgg)*maxEdgeThickness
            } 
            
            if(alphaEdge>=thresholdAlpha ){
                let line = new PIXI.Graphics();
                //line.beginFill(0xFFFFFF,1);
                line.lineStyle(Math.ceil((edgeIdx[key][4])) , 0xFFA500, alphaEdge);//other colors:0xFFA500,
                line.moveTo(edgeIdx[key][0], edgeIdx[key][1]);
                line.lineTo(edgeIdx[key][2], edgeIdx[key][3]);
                edgesContainer.addChild(line);
            }
        }
    }

    function labelsViewZoom(baseTextSize,pixiGraphStruct,high,wid,labelsMap,averageDegree,viewport,containerLabels,graph,maxDistance = 150,numOfLabelsToShowUp=5){   
    
        let nodeOrderByCluster = new Map()
        let maxDegree = 0;
        let pointZero = new PIXI.Point(0,0);
        let count=0;
        let sortedByDegree;
        let varianceDegree=0;
        let nodeCount=0;
        let minimumDegree = 0;

        //selection of nodes inside de view to render
        for(let i = 0; i<nodes;i++){
            
            let temp = pixiGraphStruct.pixiNodes[graph.nodes[i]['id']]//.pixiNode.toGlobal(pointZero);
            
            let xx = temp.x;
            let yy = temp.y;

            if(( xx>(0) && xx<(high))){
                if(( yy>(0) && yy<(wid))){
                    
                    let selectedNode = pixiGraphStruct.pixiNodes[graph.nodes[i]['id']];
                    if(maxDegree<selectedNode.degree){
                        maxDegree=selectedNode.degree;
                    }
                    if(!nodeOrderByCluster.has(selectedNode.clusterName)){
                        let tempObj = {
                            id : selectedNode.id,
                            degree:selectedNode.degree,
                            clusterValue:selectedNode.clusterValue
                        }
                        nodeOrderByCluster.set(selectedNode.clusterName,tempObj)
                    }else{
                        let tempObj = {
                            id : selectedNode.id,
                            degree:selectedNode.degree,
                            clusterValue:selectedNode.clusterValue
                        }
                        if(nodeOrderByCluster.get(selectedNode.clusterName).degree<tempObj.degree){
                            nodeOrderByCluster.set(selectedNode.clusterName,tempObj)
                        }
                    }
                    nodeCount++;
                    varianceDegree += Math.pow((selectedNode.degree-averageDegree),2);

                    count++;
                }
            }
            
        } 
        sortedByDegree = new Map([...nodeOrderByCluster.entries()].sort((a, b) => b[1].degree - a[1].degree));
        
        varianceDegree = Math.ceil((varianceDegree/count)); 

 
        //minimumDegree=Math.ceil((maxDegree-(maxDegree*(0.4+(viewport.lastViewport.scaleX/(60/100))/100))));
        minimumDegree=0;
        
        count = count*0.5;
     


        for(nodeToDraw of sortedByDegree){
            if((count>0)){
                let circleText;
                let style = {
                    font : 'bold 16px Arial',
                    fill : '#ffffff',
                    stroke : '#000000',
                    strokeThickness : 2,
                }

                let circle = new PIXI.Graphics();
                circle.lineStyle(0);
                circle.beginFill(0xDE3249, 1);
                circle.drawCircle(1, 1, 3);
                circle.x = pixiGraphStruct.pixiNodes[nodeToDraw[1].id].xCluster;
                circle.y = pixiGraphStruct.pixiNodes[nodeToDraw[1].id].yCluster;
                circle.endFill();
                circle.interactive = true;

                containerLabels.addChild(circle);
                if(labelsMap.size!=0){
                    circleText = new PIXI.Text(labelsMap.get(nodeToDraw[1].id),style);
                }else{
                    circleText = new PIXI.Text(nodeToDraw[1].id,style);
                     
                }
                    //circleText.style.fontSize = 16;
                circleText.style.fontSize = (Math.floor((15/maxDegree)*nodeToDraw[1].degree))+baseTextSize;
                circleText.x = pixiGraphStruct.pixiNodes[nodeToDraw[1].id].xCluster;
                circleText.y = pixiGraphStruct.pixiNodes[nodeToDraw[1].id].yCluster;

                circle.on('mouseup',()=>{circleText.visible = !circleText.visible})

                containerLabels.addChild(circleText);
            
                
                count--;
            }
        }
            
        nodeOrderByCluster.clear();
    
    }

    function showAdiacentLabels(buttonActivationZoom,labelsOnClick,baseTextSize,controlLabelAdiacent,containerAdiacentLabels,pixiGraphStruct,high,wid,circleText,circleRefToText,pointZero,labelsMap,labelsAlreadyDisplayed,maxDegTot,containerLabels){
        
        if(controlLabelAdiacent.value && !buttonActivationZoom.zoomActivation){
 
            containerAdiacentLabels.removeChildren();
            controlLabelAdiacent.value = false;
            containerLabels.visible = true;
            containerLabels.addChild(circleText,circleRefToText)

        }else if(!buttonActivationZoom.zoomActivation ){
 
            let nodeOrderByClusterAdiac = new Map()
            let sortedByDegreeAdiac;
            containerAdiacentLabels.removeChildren();
            let maxDegree = 0;

            for(edge of pixiGraphStruct.pixiNodes[circleText.refToId].archlist){

                let tempAdiac = pixiGraphStruct.pixiNodes[edge].pixiNode.toGlobal(pointZero);

                let xxAdiac = tempAdiac.x;
                let yyAdiac = tempAdiac.y;

                if(( xxAdiac>(0) && xxAdiac<(high+Math.abs(high - wid)))){
                    if(( yyAdiac>(0) && yyAdiac<(wid+Math.abs(high - wid)))){
                        
                        let selectedNodeAdiac = pixiGraphStruct.pixiNodes[edge];
                        if(maxDegree<selectedNodeAdiac.degree){
                            maxDegree=selectedNodeAdiac.degree;
                        }
                        if(!nodeOrderByClusterAdiac.has(selectedNodeAdiac.clusterName)){
                            let tempObjAdiac = {
                                id : selectedNodeAdiac.id,
                                degree:selectedNodeAdiac.degree,
                                clusterValue:selectedNodeAdiac.clusterValue
                            }
                            nodeOrderByClusterAdiac.set(selectedNodeAdiac.clusterName,tempObjAdiac);
                        }else{
                            let tempObjAdiac = {
                                id : selectedNodeAdiac.id,
                                degree:selectedNodeAdiac.degree,
                                clusterValue:selectedNodeAdiac.clusterValue
                            }
                            if(nodeOrderByClusterAdiac.get(selectedNodeAdiac.clusterName).degree<tempObjAdiac.degree){
                                nodeOrderByClusterAdiac.set(selectedNodeAdiac.clusterName,tempObjAdiac);
                            }
                        }
                    }
                }
            
            } 
            sortedByDegreeAdiac = new Map([...nodeOrderByClusterAdiac.entries()].sort((a, b) => b[1].degree - a[1].degree ));
            //console.log((viewport.lastViewport.scaleX/(60/100))/100);
            let styleAdiac = {
                font : 'bold 16px Arial',
                fill : '#ffffff',
                stroke : '#000000',
                strokeThickness : 2,
            }                
        
            for(edgeSel of sortedByDegreeAdiac){

                if( pixiGraphStruct.pixiNodes[edgeSel[1].id].clusterName!==pixiGraphStruct.pixiNodes[circleText.refToId].clusterName){
                   
                    let circleAdiac = new PIXI.Graphics();
                    let circleTextAdiac;
                    circleAdiac.lineStyle(0);
                    circleAdiac.beginFill(0xDE3249, 1);
                    circleAdiac.drawCircle(1, 1, 4);
                    circleAdiac.x = pixiGraphStruct.pixiNodes[edgeSel[1].id].xCluster;
                    circleAdiac.y = pixiGraphStruct.pixiNodes[edgeSel[1].id].yCluster;
                    circleAdiac.endFill();
                    circleAdiac.interactive = true;

                    containerAdiacentLabels.addChild(circleAdiac);

                    if(labelsMap.size!=0){
                        circleTextAdiac = new PIXI.Text(labelsMap.get(edgeSel[1].id),styleAdiac);
                    }else{
                        circleTextAdiac = new PIXI.Text(edgeSel[1].id,styleAdiac);
                    }
                    circleTextAdiac.style.fontSize = (Math.floor((15/maxDegTot)*pixiGraphStruct.pixiNodes[edgeSel[1].id].degree))+baseTextSize;
                    circleTextAdiac.x = pixiGraphStruct.pixiNodes[edgeSel[1].id].xCluster;
                    circleTextAdiac.y = pixiGraphStruct.pixiNodes[edgeSel[1].id].yCluster;

                    circleAdiac.on('mouseup',()=>{circleTextAdiac.visible = !circleTextAdiac.visible})

                    //circleTextAdiac.refToId = edgeSel[1].id;
                    //circleTextAdiac.interactive = true;
                    //circleTextAdiac.on('mouseup',() => {showAdiacentLabels(controlLabelAdiacent,containerAdiacentLabels,pixiGraphStruct,high,wid,circleTextAdiac,pointZero,labelsMap,labelsAlreadyDisplayed,maxDegTot)})
                    containerAdiacentLabels.addChild(circleTextAdiac);
                } 
                
            }
            containerAdiacentLabels.addChild(circleText,circleRefToText)
            containerLabels.visible = false;
            controlLabelAdiacent.value = true;
            //containerLabels.visible = false;
        }

    }
    
    function labelsViewPoint(buttonActivationZoom,labelsOnClick,baseTextSize,containerAdiacentLabels,pixiGraphStruct,high,wid,labelsMap,averageDegree,seeAllLabels,viewport,containerLabels,labelsList,xstart,ystart,graph,maxDistance = 150,numOfLabelsToShowUp=5){

        //TODO: aggiungere i labels al container principale solo sui punti dove non esistona gia labels visualizzati

        let nodeOrderByCluster = new Map()
        let maxDegree = 0;
        let pointZero = new PIXI.Point(0,0);
        let count=0;
        let sortedByDegree;
        //let varianceDegree=0;
        let nodeCount=0;
        let minimumDegree = 0;
        let controlLabelAdiacent = {value:false};
        let labelsAlreadyDisplayed = new Set();
        let labelsDisplayedText = new Array();
        
        //containerLabels.removeChildren();

        //selection of nodes inside de view to render
        for(let i = 0; i<nodes;i++){
            
            //let temp = pixiGraphStruct.pixiNodes[graph.nodes[i]['id']].pixiNode.toGlobal(pointZero);
            let temp = pixiGraphStruct.pixiNodes[graph.nodes[i]['id']];

            let xx = temp.x-xstart-25;
            let yy = temp.y-ystart-25;
            let distaOrig = Math.sqrt(Math.pow(xx,2)+Math.pow(yy,2));

            if(distaOrig<maxDistance){
                    
                let selectedNode = pixiGraphStruct.pixiNodes[graph.nodes[i]['id']];
                if(maxDegree<selectedNode.degree){
                    maxDegree=selectedNode.degree;
                }
                if(!nodeOrderByCluster.has(selectedNode.clusterName)){
                    let tempObj = {
                        id : selectedNode.id,
                        degree:selectedNode.degree,
                        clusterValue:selectedNode.clusterValue
                    }
                    nodeOrderByCluster.set(selectedNode.clusterName,tempObj);
                }else{
                    let tempObj = {
                        id : selectedNode.id,
                        degree:selectedNode.degree,
                        clusterValue:selectedNode.clusterValue
                    }
                    if(nodeOrderByCluster.get(selectedNode.clusterName).degree<tempObj.degree){
                        nodeOrderByCluster.set(selectedNode.clusterName,tempObj);
                    }
                }
                nodeCount++;
                //varianceDegree += Math.pow((selectedNode.degree-averageDegree),2);

                count++;
            }
            
        } 
        sortedByDegree = new Map([...nodeOrderByCluster.entries()].sort((a, b) => b[1].degree - a[1].degree ));
        //console.log((viewport.lastViewport.scaleX/(60/100))/100);
        //console.log(viewport.lastViewport.scaleX/(60/100));
        //maxDegree = 0;//Math.floor(maxDegree*(1-(viewport.lastViewport.scaleX/(60/100))/100));

        //varianceDegree = Math.ceil((varianceDegree/count)); 
        //console.log("Mean: " + averageDegree + "Variance: "+varianceDegree+" max degree "+maxDegree)

        if(!seeAllLabels){

            count = Math.ceil(count*(viewport.lastViewport.scaleX/(60/100))/100);
            minimumDegree=Math.ceil((maxDegree-(maxDegree*(0.6+(viewport.lastViewport.scaleX/(40/100))/100))));
        }


        for(nodeToDraw of sortedByDegree){
            if(count>0 && (nodeToDraw[1].degree>=minimumDegree)){//nodeToDraw[1].degree>=maxDegree && 
                if(!labelsList.has(pixiGraphStruct.pixiNodes[nodeToDraw[1].id].clusterName)){
                    let circleText;
                    let style = {
                        font : 'bold 16px Arial',
                        fill : '#ffffff',
                        stroke : '#000000',
                        strokeThickness : 2,
                    }
                    let circle = new PIXI.Graphics();
                    circle.lineStyle(0);
                    circle.beginFill(0xDE3249, 1);
                    circle.drawCircle(1, 1, 5);
                    circle.x = pixiGraphStruct.pixiNodes[nodeToDraw[1].id].xCluster;
                    circle.y = pixiGraphStruct.pixiNodes[nodeToDraw[1].id].yCluster;
                    labelsList.add(pixiGraphStruct.pixiNodes[nodeToDraw[1].id].clusterName);
                    circle.endFill();
                    circle.interactive = true;
                    containerLabels.addChild(circle);

                    if(labelsMap.size!=0){
                        circleText = new PIXI.Text(labelsMap.get(nodeToDraw[1].id),style);
                    }else{
                        circleText = new PIXI.Text(nodeToDraw[1].id,style);
                    }

                    //circleText.style.fontSize = 16;
                    circleText.style.fontSize = (Math.floor((15/maxDegree)*nodeToDraw[1].degree))+baseTextSize;
                    circleText.x = pixiGraphStruct.pixiNodes[nodeToDraw[1].id].xCluster;
                    circleText.y = pixiGraphStruct.pixiNodes[nodeToDraw[1].id].yCluster;
                    circleText.interactive = true;

                    circleText.refToId = nodeToDraw[1].id;
                    containerLabels.addChild(circleText);
                    circleText.on('mouseup',() => {showAdiacentLabels(buttonActivationZoom,labelsOnClick,baseTextSize,controlLabelAdiacent,containerAdiacentLabels,pixiGraphStruct,high,wid,circleText,circle,pointZero,labelsMap,labelsAlreadyDisplayed,maxDegree,containerLabels)});
                    circle.on('mouseup',()=>{ circleText.visible = !circleText.visible})
                    labelsDisplayedText.push(circleText)

                    
                    count--;

                }
                
            }
        }

            
        nodeOrderByCluster.clear();
    
        return labelsDisplayedText;
    }