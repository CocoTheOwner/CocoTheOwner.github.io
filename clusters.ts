import { MailGraph } from "./mailGraph"

class clusters { //class to hold clusters

    stoQuery(graph: MailGraph, nodes: number[], t: number, center: number) { //creates single cluster from center
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

    pickNode(nodes: number[]){ //get random element from the nodes
        return nodes[Math.floor(Math.random() * nodes.length)];
    }

    stoC(graph: MailGraph, t: number){
        let nodes: number[] = graph.copynodes()
        let clustering: number[][] = []
        while (nodes.length > 0) {                                 // as long as there are unclustered
            let node: number = this.pickNode(nodes)
            let cluster: number[] = this.stoQuery(graph, nodes, t, node)  //get cluster
            nodes = nodes.filter( x => !cluster.includes(x))        // remove from nodes
            clustering.push(cluster)
        }
        return clustering
    }



    clusterLinks(graph: MailGraph, clustering: number[][]){
        let links: number[][] = []
        for (let i = 0; i < clustering.length; i++){
            let link: number[] = Array(i).fill(-1)
            for (let j = i+1; j < clustering.length; j++){
                link.push(graph.clusterDist(clustering[i], clustering[j]))
            }
            links.push(link)
        }
        return links
    }
}

export default clusters