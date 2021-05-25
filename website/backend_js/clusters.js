define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class cluster {
        //creates a single cluster
        //params:
        //  -graph: graph to create cluster in
        //  -nodes: will only include nodes from this set
        //  -t:     distance
        //  -center: cluster starts here
        //return:
        //  -array of nodes
        stoQuery(graph, nodes, t, center) {
            let Q = [center]; // queue of nodes to pass through
            let cluster = [center]; // cluster to return
            while (Q.length > 0) {
                let node = Q.shift(); // pop queue
                for (let employee of graph.neighbours(node)) { // add neighbours that are not yet in and within dist
                    if (!cluster.includes(employee) && !Q.includes(employee) && nodes.includes(employee) && graph.distance(center, employee) > t) {
                        cluster.push(employee);
                        Q.push(employee);
                    }
                }
            }
            return cluster;
        }
        //picks a node
        //params:
        //  -nodes: nodes to pick from
        //returns:
        //  -node
        pickNode(nodes) {
            return nodes[Math.floor(Math.random() * nodes.length)];
        }
        //creates all clusters
        //params:
        //  -graph: graph to divide into clusters
        //  -t:     distance
        //returns:
        //  -array of clusters
        stoC(graph, t) {
            let nodes = graph.copynodes(); // get a copy to modify
            let clustering = []; // array to hold result
            while (nodes.length > 0) { // as long as there are unclustered
                let node = this.pickNode(nodes);
                let cluster = this.stoQuery(graph, nodes, t, node); //get cluster
                nodes = nodes.filter(x => !cluster.includes(x)); // remove from nodes
                clustering.push(cluster);
            }
            return clustering;
        }
        //gets the links between clusters
        //params:
        //  -graph: the graph where the cluster exists
        //  -clustering: the clusters whitin that graph
        //returns:
        //  -2d array where a[i][j] is the distance from cluster i to j, bottom-left triangle is -1
        clusterLinks(graph, clustering) {
            let links = []; //object to return
            for (let i = 0; i < clustering.length; i++) {
                let link = Array(i).fill(-1); //all distances from i
                for (let j = i + 1; j < clustering.length; j++) {
                    link.push(graph.clusterDist(clustering[i], clustering[j]));
                }
                links.push(link);
            }
            return links;
        }
    }
    exports.default = cluster;
});
