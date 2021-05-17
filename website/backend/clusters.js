class cluster { //class to hold clusters

    stoQuery(graph, nodes, t, center) { //creates single cluster from center
        let Q = [center]                          // queue of nodes to pass through
        let cluster = [center]                    // cluster to return
        while (Q.length > 0){
            let node = Q.shift()                          // pop queue
            for (let employee of graph.neighbours(node)){                    // add neighbours that are not yet in and within dist
                if (!cluster.includes(employee) && !Q.includes(employee) && nodes.includes(employee) && graph.distance(center, employee) > t) {
                    cluster.push(employee)
                    Q.push(employee)
                }
            }
        }
        return cluster
    }

    pickNode(nodes){ //get random element from the nodes
        return nodes[Math.floor(Math.random() * nodes.length)];
    }

    stoC(graph, t){
        let nodes = graph.copynodes()
        let clustering = []
        while (nodes.length > 0) {                                 // as long as there are unclustered
            let node = this.pickNode(nodes)
            let cluster = this.stoQuery(graph, nodes, t, node)  //get cluster
            nodes = nodes.filter( x => !cluster.includes(x))        // remove from nodes
            clustering.push(cluster)
        }
        return clustering
    }



    clusterLinks(graph, clustering){
        let links = []
        for (let i = 0; i < clustering.length; i++){
            let link = Array(i).fill(-1)
            for (let j = i+1; j < clustering.length; j++){
                link.push(graph.clusterDist(clustering[i], clustering[j]))
            }
            links.push(link)
        }
        return links
    }
}

export default cluster