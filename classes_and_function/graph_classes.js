class graphClass {

    constructor(id) {
        this.id = id;
        this.pixiNodes = {};
        this.pixiEdges = {};
    }

    getId() {
        return this.id;
    }

    insertNodes(node) {
        if(!this.pixiNodes[node.id]){
            this.pixiNodes[node.id]=node;
        }else{
            console.log('This node already exist');
        }
    }
    removeNode(node) {
        delete this.pixiNodes[node.id];
    }

    getNodeById(idx) {
        return this.pixiNodes[idx];
    }

    insertEdge(edge) {
        if(!this.pixiEdges[edge.id]){
            this.pixiEdges[edge.id]=edge;
        }else{
            console.log('This edge already exist');
        }
    }
    removeEdge(edge) {
        delete this.pixiEdges[edge.id];
    }

    numberOfNodes() {
        return this.pixiNodes.length;
    }

    numberOfEdges() {
        return this.pixiEdges.length;
    }

    getPixiNodes() {
        return this.pixiNodes;
    }

}

class edgeClass {

    constructor(line, sourceNode, targetNode) {
        this.id = ""+sourceNode.id+targetNode.id;
        this.pixiEdge = line;
        this.source = sourceNode;
        this.target = targetNode;
    }

    getName() {
        return this.name;
    }

    getSource() {
        return this.source;
    }

    getTarget() {
        return this.target;
    }

    changeSource(newSource) {
        this.source = newSource;
    }

    changeTarget(newTarget) {
        this.target = newTarget;
    }
}

class NodeClass{
    
    constructor(id,node,x,y,weight=1,degree=0,archlist=[]) {
        this.id = id;
        this.pixiNode=node ;
        this.x = x;
        this.y = y;
        this.weight = weight;
        this.xCluster;
        this.yCluster;
        this.clusterName;
        this.degree = degree;
        this.clusterValue;  
        this.archlist = archlist;
    }

  
    setXY(x,y){
        this.x = x;
        this.y = y;
    }
    setClusterValue(x){
        this.clusterValue = x;
    }

    setPixel(x,y){
        this.xCluster = x;
        this.yCluster = y;
        this.clusterName = ""+x+"-"+y;
    }

    setWeight(weight){
        this.weight = weight;
    }

    setDegree(degree){
        this.degree = degree;
    }

    addOneDegree(){
        this.degree+=1;
    }

    setArchList(edgesList){
        this.archlist = edgesList;
    }

}