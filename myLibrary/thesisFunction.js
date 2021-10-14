

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

        }

    }

    function edgeCompute(area,wid,high,pixiGraph,links,graph,edgesContainer,thresholdAlpha,maxEdgeThickness){

        let edgeIdx = {};
        let maxEdgeAgg = 1;

        for (let i = 0; i < links; ++i) {

            let sour = pixiGraph.getNodeById(graph.edges[i]['source'].id);
            let targ = pixiGraph.getNodeById(graph.edges[i]['target'].id);

            if(( sour.x>(-(area)) && sour.x<(high+Math.abs(high - wid)+area))){
                if(( sour.y>(-(area)) && sour.y<(wid+Math.abs(high - wid)+area))){

                    if(( targ.x>(-(area)) && targ.x<(high+Math.abs(high - wid)+area))){
                        if(( targ.y>(-(area)) && targ.y<(wid+Math.abs(high - wid)+area))){
                           
                            let sourCluster = ""+sour.xCluster+sour.yCluster;
                            let targCluster = ""+targ.xCluster+targ.yCluster;
                            //if((sour.cluster) != (targ.cluster)){
                            if(sourCluster != targCluster){
                
                                //let idClusterEdge = ""+sour.cluster+targ.cluster;
                                let idClusterEdge = ""+sourCluster+targCluster;
                
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
        edgesContainer.removeChildren();
        
        for(var key in edgeIdx){
            let alphaEdge = (edgeIdx[key][4]/maxEdgeAgg);

            if(alphaEdge>=thresholdAlpha ){
                let line = new PIXI.Graphics();
                //line.beginFill(0xFFFFFF,1);
                line.lineStyle(Math.ceil((edgeIdx[key][4]/scaling)) , 0x641E16, alphaEdge);
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

    function edgeComputeZoom(xstart,ystart,xstop,ystop,pixiGraph,links,graph,edgesContainer,thresholdAlpha,maxEdgeThickness){ 

        let edgeIdx = {};
        let maxEdgeAgg = 1;

        for (let i = 0; i < links; ++i) {

            let sour = pixiGraph.getNodeById(graph.edges[i]['source'].id);
            let targ = pixiGraph.getNodeById(graph.edges[i]['target'].id);

            let sourCluster = ""+sour.xCluster+sour.yCluster;
            let targCluster = ""+targ.xCluster+targ.yCluster;
            //if((sour.cluster) != (targ.cluster)){
            if(sourCluster != targCluster){

                //let idClusterEdge = ""+sour.cluster+targ.cluster;
                let idClusterEdge = ""+sourCluster+targCluster;

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
        let scaling = maxEdgeAgg/maxEdgeThickness;
        edgesContainer.removeChildren();
        
        for(var key in edgeIdx){
            let alphaEdge = edgeIdx[key][4]/maxEdgeAgg;

            if(alphaEdge>=thresholdAlpha  ){
                let line = new PIXI.Graphics();
                //line.beginFill(0xFFFFFF,1);
                line.lineStyle(Math.ceil((edgeIdx[key][4]/scaling)) , 0x641E16, alphaEdge);
                line.moveTo(edgeIdx[key][0], edgeIdx[key][1]);
                line.lineTo(edgeIdx[key][2], edgeIdx[key][3]);
                edgesContainer.addChild(line);
            }
        }
    }

    function createMatOut(pixiGraph,wid,high,vecXY,precomputedMatrix,rag,maxValueObj){
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

    function labelsView(xstart,ystart,graph,pixiGraph,maxDistance = 100,numOfLabelsToShowUp=10){   
        
        
        let indici = [];
        let nodeMap = new Map();
        let numberOfNodes = graph.nodes.length;
        
        //selection of nodes inside the zoom view to render
        for(let i = 0; i<numberOfNodes;i++){

            let temp = pixiGraph.pixiNodes[graph.nodes[i]['id']];
            let xx = Math.round(temp.x-xstart);
            let yy = Math.round(temp.y-ystart);
            let distaOrig = Math.sqrt(Math.pow(xx,2)+Math.pow(yy,2));
            if(distaOrig<maxDistance){
                nodeMap.set(graph.nodes[i]['id'],pixiGraph.pixiNodes[graph.nodes[i]['id']].degree)    
            }
        }

        let sortedNodeMap = new Map([...nodeMap.entries()].sort((a,b)=>b[1]-a[1]));
        let k = 0;
        for(elem of sortedNodeMap){
            if(k<numOfLabelsToShowUp){
                indici[k] = elem[0]
               
                pixiGraph.pixiNodes[elem[0]].pixiNode.visible = true;
                k++;
            }else{
                break;
            }
        }
        sortedNodeMap.clear();
        nodeMap.clear();

        return indici;
    
    }