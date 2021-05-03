import { Email } from "./csvParser";

/** A class representing a directed graph for email traffic. */
export class MailGraph {
    private emails: Email[];
    private graph: { [fId: number]: {[tId: number]: number[]} } = {};

    /**
     * Create a new graph based on an interval between two dates.  
     * If any one of the indices is not given, we assume the beginning/end of time.
     * 
     * Please remember that the `to` time is _exclusive_. E-mails from this day are **not** added.
    */
    constructor(emailArr: Email[], from: Date = new Date(0), to: Date = new Date(1)) {
        this.emails = emailArr;
        let startIndex = findTimeIndex(from);
        let endIndex = findTimeIndex(to);

        // Loop through all emails in the interval
        while (startIndex < endIndex) {
            let mail = this.emails[startIndex++];

            // If this is fromId's first mail, add fromId to the graph as a node.
            if (!(mail.fromId in this.graph)) {
                this.graph[mail.fromId] = {};
            }
            // If this mail is the first fromId->toId mail, add toId to fromId's neighbours
            if (!(mail.toId in this.graph[mail.fromId])) {
                this.graph[mail.fromId][mail.toId] = [];
            }
            this.graph[mail.fromId][mail.toId].push(mail.appreciation);
        }
    }

    // Add a new edge (email) to the graph.
    // If any one of the required nodes is missing, they are added.
    addMail(mail: Email) {
        this.graph[mail.fromId][mail.toId].push(mail.appreciation);
    }

    /**
    * Function which normalizes the data points into the interval [0...1]
    * To be used for the distance function.
    */
    normalizeData(value: number, minimum: number, maximum: number): number {
	    return (value - minimum) / (maximum - minimum);
    }

    // Yet to be defined
    distance (from: number, to: number): number {
        return 10;
    }

    copynodes() {
        return Object.keys(this.graph)
    }

    neighbours(node: number) {
        return Object.keys(this.graph[node])
    }
}

/**
 * Finds the index of the first or last mail sent on the specified date, based on whether we look on the low end or the high end.  
 * If no such date exists, the index of the date right after what we looked for is returned.  
 * lowEnd does not have to be specified. If it isn't, default value `true` will be used.
 * 
 * Two special cases are included for returning the first and last index of the array:
 * ```let i1 = findTimeIndex(new Date(0));  // Returns 0```  
 * ```let i2 = findTimeIndex(new Date(1));  // Returns emails.length```
*/
function findTimeIndex(date: Date): number {
    if (date.getTime() === 0) {             // Special case: Return the first element of the array
        return 0;
    } else if (date.getTime() === 1) {      // Special case: Return the last element of the array
        return this.emails.length;
    } else {                                // Normal case: Perform binary search to find the correct indices.
        let l = 0;
        let r = this.emails.length - 1;

        // While true, keep searching
        while(l <= r) {
            let m = Math.floor((l + r) / 2);
            if (this.emails[m].date < date) {
                l = m + 1;
            } else if (this.emails[m].date > date) {
                r = m - 1;
            } else {
                // If we found the right date, look for duplicates that may
                //   occur before or after the current item.
                while (this.emails[--m].date.getTime() === date.getTime()) {} ;

                // Return the index of the first or last occurrance of our date.
                // First if we look for a date on the low end, last if not.
                return m + 1;
            }
        }

        // If we did not find our date in the array, return the next acceptable thing.
        // Return the first date after what we looked for.
        return r + 1;
    }
}
