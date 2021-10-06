importScripts('greadability/greadability.js');
importScripts('ogdf/ogdfwithFMMMPAGEMEMGROW.js');


onmessage = function(e) {
    // the passed-in data is available via e.data

 
    initOGDF().then(function (Module) {
                
        let dic = {}
        let numOfNodes = e.data.nodes.length;
        for (let i = 0; i < numOfNodes; ++i) {
            if (e.data.nodes[i]['id'] in dic) {
                console.log('there is a bug');
            } else {
                dic[e.data.nodes[i]['id']] = i;
            }
        }
        //console.log("dopo riempimento dic")
        nodes = numOfNodes;
        links = e.data.edges.length;
        let source = Module._malloc(4 * links);
        let target = Module._malloc(4 * links);
        // store the edge information to wasm array
        for (let i = 0; i < links; ++i) {
            Module.HEAP32[source / 4 + i] = dic[e.data.edges[i].source.id];
            Module.HEAP32[target / 4 + i] = dic[e.data.edges[i].target.id];
        }

        let tt = Module._PAGERANK(nodes, links, source, target);
        for (let i = 0; i < nodes; ++i) {
            e.data.nodes[i]['peso'] = Module.HEAPF32[(tt >>> 2) + i].toFixed(6);
        }
 
        let result = Module._FM3(nodes, links, source, target);
        //console.log("dopo FMMM")
        //console.log("pima di creare graphics circle")
        // get nodes position from result
        for (let i = 0; i < nodes; ++i) {
            e.data.nodes[i]['x'] = Module.HEAPF32[(result >>> 2) + i * 2];
            e.data.nodes[i]['y'] = Module.HEAPF32[(result >>> 2) + i * 2 + 1];
        }

        e.data.maxX = Module.HEAPF32[(result >>> 2) + nodes * 2];
        e.data.maxY = Module.HEAPF32[(result >>> 2) + nodes * 2 + 1];

        Module._free(source);
        Module._free(target);
        Module._free_buf(result);


        //console.log("dopo aver aggiunto tutti gli archi")
        dic = null;
        result = null;
        postMessage(e.data)
 
    });


}