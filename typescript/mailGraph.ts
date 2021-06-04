import { Email, Employee } from "./csvParser";

// A chord that represents the amount of emails between two job types
export class MailChord {
    public from: string;
    public to: string;
    public value: number;

    constructor(from: string, to: string, value: number) {
        this.from = from;
        this.to = to;
        this.value = value;
    }
}

//a class holding a directed graph for email traffic
export class MailGraph {
    public startIndex: number;
    public endIndex: number;
    
    private mailArr: Email[];
    private startDate: Date;
    private endDate: Date;
    private graph: { [fId: number]: { [tId: number]: number[] } } = {};


    //Mailgraph constructor
    //params:
    //  -mailArr: email array to create graph from (sorted for filters)
    constructor(mailArr: Email[]) {
        // Save the address of the email array we use
        this.mailArr = mailArr;

        // Special dates for our system: We set the MailGraph to span all emails here.
        this.setDates(new Date(0), new Date(1));
    }

    // set the new dates for the MailGraph, save their indices in the email array
    //  and save all traffic specifics in the 'graph' variable.
    // params:
    //  -from:    filters from this date (inclusive)
    //  -to:      filters up until this date (exclusive)
    setDates(from: Date, to: Date) {
        this.startDate = from;
        this.endDate = to;

        this.update();
    }

    // Find and set the start and end indices corresponding to the current start and end dates.
    //  Also fill in the 'graph' variable with all applicable email traffic.
    update() {
        //find indexes of filter
        this.startIndex = findTimeIndex(this.mailArr, this.startDate);
        this.endIndex = findTimeIndex(this.mailArr, this.endDate);

        this.graph = {};

        // Loop through all emails in the interval
        for (let i = this.startIndex; i < this.endIndex; i++) {
            let mail = this.mailArr[i];

            // If this is fromId's first mail, add fromId to the graph as a node.
            if (!(mail.fromId in this.graph)) {
                this.graph[mail.fromId] = {};
            }

            // If this mail is the first fromId->toId mail, add toId to fromId's neighbours
            if (!(mail.toId in this.graph[mail.fromId])) {
                this.graph[mail.fromId][mail.toId] = [];
            }

            //add the mail as an edge
            this.addMail(mail);
        }
    }

    //convert MailGraph data to input data for AmChart chord plot input
    //returns:
    //  -array of chord specifics
    generateJobChordInput(lookup: { [id: number]: Employee }): any[] {
        let chartData: MailChord[] = [];
        let visited: string[] = [];

        // Add all real data (UNDIRECTED)
        // Loop through all senders
        for (const from in this.graph) {
            visited.push(from);

            // Loop through all receivers
            for (const to in this.graph[from]) {
                // Do not account for emails sent between people with the same title
                if (lookup[from].jobTitle === lookup[to].jobTitle) {
                    continue;
                }

                // Only add data if the receiver is not a previous sender.
                if (!(to in visited)) {
                    // Count the amount of emails sender -> receiver
                    let mailCountSum = this.graph[from][to].length;

                    // If the receiver sent to the sender, too ...
                    if (to in this.graph && from in this.graph[to]) {
                        // ... add the amount of emails sender <- receiver
                        mailCountSum += this.graph[to][from].length
                    }

                    if (chartData.length === 0) {
                        chartData.push(new MailChord(lookup[from].jobTitle, lookup[to].jobTitle, mailCountSum));
                    }
    
                    // Add a new chord if necessary. Otherwise, add the emails
                    //  the correct MailChord-
                    let chordFound = false;
                    for (const chord of chartData) {
                        if (chord.from === lookup[from].jobTitle && chord.to === lookup[to].jobTitle) {
                            chord.value += mailCountSum;
                            chordFound = true;
                            break;
                        } else if (chord.from === lookup[to].jobTitle && chord.to === lookup[from].jobTitle) {
                            chord.value += mailCountSum;
                            chordFound = true;
                            break;
                        }
                    }
                    if (!chordFound) {
                        chartData.push(new MailChord(lookup[from].jobTitle, lookup[to].jobTitle, mailCountSum));
                    }
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