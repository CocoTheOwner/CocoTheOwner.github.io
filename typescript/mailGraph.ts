import { Email } from "./csvParser";

//a class holding a directed graph for email traffic
export class MailGraph {
    private emails: Email[];
    private graph: { [fId: number]: { [tId: number]: number[] } } = {};

    //Mailgraph constructor
    //params:
    //  -mailArr: email array to create graph from (sorted for filters)
    //  -from:    filters from this date (inclusive) (default = first possible)
    //  -to:      filters up until this date (exclusive) (default = last possible)
    constructor(mailArr: Email[], from: Date = new Date(0), to: Date = new Date(1)) {
        this.emails = [];
        //find indexes of filter
        let startIndex = findTimeIndex(mailArr, from);
        let endIndex = findTimeIndex(mailArr, to);

        // Loop through all emails in the interval
        for (let i = startIndex; i < endIndex; i++) {
            let mail = mailArr[i];
            this.emails.push(mailArr[i]);

            // If this is fromId's first mail, add fromId to the graph as a node.
            if (!(mail.fromId in this.graph)) {
                this.graph[mail.fromId] = {};
            }

            // If this mail is the first fromId->toId mail, add toId to fromId's neighbours
            if (!(mail.toId in this.graph[mail.fromId])) {
                this.graph[mail.fromId][mail.toId] = [];
            }

            //add the mail as an edge
            this.graph[mail.fromId][mail.toId].push(mail.appreciation);
        }
    }

    //convert MailGraph data to input data for AmChart chord plot input
    //returns:
    //  -array of chord specifics
    generateChordInput(): any[] {
        let chartData: any[] = [];
        let visited: string[] = [];

        // Add property fields, which look like this:
        // {"from":"Monica", "image":"monica.png", "color":colors.Monica},

        // Add all real data (UNDIRECTED)
        // Loop through all senders
        for (const from in this.graph) {
            visited.push(from);

            // Loop through all receivers
            for (const to in this.graph[from]) {
                // Only add data if the receiver is not a previous sender.
                if (!(to in visited)) {
                    // Count the amount of emails sender -> receiver
                    let mailCountSum = this.graph[from][to].length;

                    // If the receiver sent to the sender, too ...
                    if (this.graph[to][from]) {
                        // ... add the amount of emails sender <- receiver
                        mailCountSum += this.graph[to][from].length
                    }
    
                    // Add the new chord data to the array of chord data.
                    chartData.push( {"from":from, "to":to, "value":mailCountSum} );
                }
            }
        }

        return chartData;
    }

    //
    generateSankeyInput(): any[] {
        let chartData: any[] = [];

        return chartData;
    }

    //add single mail to graph (and nodes if they are missing)
    //params:
    //  -mail: email to be added
    //returns: nothing
    addMail(mail: Email) {
        this.graph[mail.fromId][mail.toId].push(mail.appreciation);
    }

    //create a copy of this graphs nodes
    //returns:
    //  -array of nodes
    copynodes(): number[] {
        let nodes: number[] = [];
        for (let key in this.graph) {
          nodes.push(parseInt(key));        //apperently keys must be strings ._.
        }
        return nodes;
    }

    //get all neighbours of a node
    //params:
    //  -node: node to get the neigbours of
    //returns:
    //  -array of nodes
    neighbours(node: number): number[] {
        let neighbours: number[] = [];
        for (let key in this.graph[node]) {
          neighbours.push(parseInt(key));   //again keys are str, so parse to int
        }
        return neighbours;
      }



    //distance between 2 nodes
    //params:
    //  -employeeA/B: nodes to calc distance between
    //returns:
    //  -amount of mails sent between a and b
    distance(employeeA: number, employeeB: number): number {
        let count = 0;
        
        // Number of emails from A to B
        try { //dirty check to prevent error if no mails were sent from a to b
            count += this.graph[employeeA][employeeB].length
        }catch {}

        // Number of emails from B to A
        try {
            count += this.graph[employeeB][employeeA].length
        }catch {}

        return count;
    }

    //distance of 2 clusters (for edgebundling)
    //params:
    //  -clusterA/B: clusters to calc distance between
    //returns:
    //  -amount of mails sent between a and b
    clusterDist(clusterA: number[], clusterB: number[]){
        let dist = 0
        for(let i of clusterA){
            for(let j of clusterB){
                dist += this.distance(i,j)
            }
        }
        return dist
    }
}

//finds first email sent on/after a date
//params:
//  -mailArr: the array to find the mail in
//  -date:    date to find (if Date(0), returns first element; if Date(1), return last)
//returns:
//  -index of mail found
export function findTimeIndex(mailArr: Email[], date: Date): number {
    if (date.getTime() === 0) { return 0; }                     // Special case: Return the first element of the array
    else if (date.getTime() === 1) { return mailArr.length; }   // Special case: Return the last element of the array
    else {                                                      // Normal case: Perform binary search to find the correct indices.
        let l = 0;
        let r = mailArr.length - 1;

        // While true, keep searching
        while(l <= r) {
            let m = Math.floor((l + r) / 2);    //find middle of search area
            if (mailArr[m].date < date) { l = m + 1; }
            else if (mailArr[m].date > date) { r = m - 1; }
            else {
                // If we found the right date, look for duplicates that may occur before the current item.
                while (mailArr[--m].date.toDateString() === date.toDateString()){};

                // Return the index of the first occurrance of our date.
                return m + 1;
            }
        }

        // If we did not find our date in the array, return the first mail after what we looked for.
        return r + 1;
    }
}

// TODO: Should we return the mailGraph??
// TODO: Maybe we should write this code in 'visualizationController.ts' instead.
function updateVisualizations(mailArr: Email[]): MailGraph {
    // Get the two date strings for the MailGraph
    let dateStrings = (<HTMLInputElement>document.getElementById("calendar")).value.split(" - ");

    // Gather all emails that lie in the selected timeframe
    let newMailGraph = new MailGraph(mailArr, new Date(dateStrings[0]), new Date(dateStrings[1]));

    // TODO: assign mailGraph output to chart input
    // chordChart.data = newMailGraph.generateChordInput();

    // TODO: assign mailGraph output to sankey input
    // sankeyChart.data = newMailGraph.generateSankeyInput();

    return newMailGraph;
}