import { MailGraph } from "./mailGraph"

class cluster { //class to hold clusters

    //creates a single cluster
    //params:
    //  -graph: graph to create cluster in
    //  -nodes: will only include nodes from this set
    //  -t:     distance
    //  -center: cluster starts here
    //return:
    //  -array of nodes
    stoQuery(graph: MailGraph, nodes: number[], t: number, center: number) {
        let Q: number[] = [center]                          // queue of nodes to pass through
        let cluster: number[] = [center]                    // cluster to return
        while (Q.length > 0){
            let node: number = Q.shift() as number                           // pop queue
            for (let employee of graph.neighbours(node)){                    // add neighbours that are not yet in and within dist
                if (!cluster.includes(employee) && !Q.includes(employee) && nodes.includes(employee) && graph.distance(center, employee) > t) {
                    cluster.push(employee)
                    Q.push(employee)
                }
            }
        }
        return cluster
    }

    //picks a node
    //params:
    //  -nodes: nodes to pick from
    //returns:
    //  -node
    pickNode(nodes: number[]){ //get random element from the nodes
        return nodes[Math.floor(Math.random() * nodes.length)];
    }

    //creates all clusters
    //params:
    //  -graph: graph to divide into clusters
    //  -t:     distance
    //returns:
    //  -array of clusters
    stoC(graph: MailGraph, t: number){
        let nodes: number[] = graph.copynodes()                     //get a copy to modify
        let clustering: number[][] = []                             //array to hold result
        while (nodes.length > 0) {                                  // as long as there are unclustered
            let node: number = this.pickNode(nodes)
            let cluster: number[] = this.stoQuery(graph, nodes, t, node)    //get cluster
            nodes = nodes.filter( x => !cluster.includes(x))                // remove from nodes
            clustering.push(cluster)
        }
        return clustering
    }

    //gets the links between clusters
    //params:
    //  -graph: the graph where the cluster exists
    //  -clustering: the clusters whitin that graph
    //returns:
    //  -2d array where a[i][j] is the distance from cluster i to j, bottom-left triangle is -1
    clusterLinks(graph: MailGraph, clustering: number[][]){
        let links: number[][] = []                                      //object to return
        for (let i = 0; i < clustering.length; i++){
            let link: number[] = Array(i).fill(-1)                 //all distances from i
            for (let j = i+1; j < clustering.length; j++){
                link.push(graph.clusterDist(clustering[i], clustering[j]))
            }
            links.push(link)
        }
        return links
    }
}

export default cluster