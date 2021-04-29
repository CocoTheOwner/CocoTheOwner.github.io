import { MailGraph } from "./csvParser" // needs proper exports

class clusters { //class to hold clusters

    stoQuery(graph: MailGraph, t: number, center: number) { //creates single cluster from center
        let Q: number[] = [center]                          // queue of nodes to pass through
        let cluster: number[] = [center]                    // cluster to return
        while (Q.length > 0){
            let node: number | undefined = Q.shift()                 // pop queue
            for (let i of graph.neigbours(node)){                    // add neighbours that are not yet in and within dist
                if (Q.includes(i) && graph.distance(center, i) <= t) {
                    cluster.push(i)
                    Q.push(i)
                }
            }
        }
        return cluster
    }

    pickNode(nodes: number[]){ //get random element from the nodes
        return nodes[Math.floor(Math.random() * nodes.length)];
    }

    stoC(graph: MailGraph, t: number){
        let nodes: number[] = graph.copynodes()
        let clustering: number[][] = [[]]
        while (nodes) {                                 // as long as there are unclustered
            let node: number = this.pickNode(nodes)
            let cluster: number[] = this.stoQuery(graph, t, node)  //get cluster
            nodes.filter( x => !cluster.includes(x))        // remove from nodes
            clustering.push(cluster)
        }
        return clustering
    }

}

export default clusters