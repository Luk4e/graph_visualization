
importScripts('greadability/greadability.js');

onmessage = function(e) {
    // the passed-in data is available via e.data
    if(e.data.nodes.length == 0 && e.data.edges.length == 0){
        console.log("Devi inserire un grafo prima di poter calcolare la Greadability");
        postMessage(false);
    }else{
        console.log("start greadability");
        let gred = greadability.greadability(e.data.nodes,e.data.edges);
        //console.log("greadability results");
        //console.log(gred);
        postMessage(gred);
    }


};