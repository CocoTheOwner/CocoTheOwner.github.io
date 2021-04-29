import { MailGraph , Employee } from "./csvParser" // needs proper exports

class clusters { //class to hold clusters

    stoQuery(graph: MailGraph, t: number, center: Employee) { //creates single cluster from center
        let Q: Employee[] = [center]                          // queue of nodes to pass through
        let cluster: Employee[] = [center]                    // cluster to return
        while (Q){                                            // is this equal to q.notempty or something
            let node: Employee = Q.shift()                    // pop queue
            for (let i of node.neigbours){                    // add neighbours that are not yet in and within dist
                if (Q.includes(i) && graph.distance(center, i) <= t) {
                    cluster.push(i)
                    Q.push(i)
                }
            }
        }
        return cluster
    }

    stoC(graph: MailGraph, t: number){
        let nodes: Employee[] = graph.copynodes()       //need function to get a copy of all nodes
        let clustering: Employee[][] = [[]]
        while (nodes) {                                 // as long as there are unclustered
            let node: Employee = graph.pickNode()       // needs implement
            let cluster: Employee[] = this.stoQuery(graph, t, node)  //get cluster
            nodes.filter( x => !cluster.includes(x))        // remove from nodes
            clustering.push(cluster)
        }
        return clustering
    }
}
