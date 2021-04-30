import * as fs from 'fs';
import * as rd from 'readline';


let emails: Array<Email> = [];                  // Array for all emails' details, except for employee specifics
let lookup: { [id: number]: Employee } = {};    // Dictionary for all employees' specifics with their ID as key


/** A class for email data with light employee data. */
class Email {
    // Constructor creates class letiables and immediately assigns their values.
    constructor (
        public date: Date,
        public fromId: number,
        public toId: number,
        public mailType: string,
        public appreciation: number
    ) {}
}

/** A class for employee specifics. */
class Employee {
    constructor (
        public email: string,
        public jobTitle: string
    ) {}
}

/** A class representing a directed graph for email traffic. */
class MailGraph {
    private graph: { [fId: number]: {[tId: number]: number[]} } = {};

    /**
     * Create a new graph based on an interval between two dates.  
     * If any one of the indices is not given, we assume the beginning/end of time.
     * 
     * Please remember that the `to` time is _exclusive_. E-mails from this day are **not** added.
    */
    constructor(from: Date = new Date(0), to: Date = new Date(1)) {
        let startIndex = findTimeIndex(from);
        let endIndex = findTimeIndex(to);

        // Loop through all emails in the interval
        while (startIndex < endIndex) {
            let mail = emails[startIndex++];

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
        return emails.length;
    } else {                                // Normal case: Perform binary search to find the correct indices.
        let l = 0;
        let r = emails.length - 1;

        // While true, keep searching
        while(l <= r) {
            let m = Math.floor((l + r) / 2);
            if (emails[m].date < date) {
                l = m + 1;
            } else if (emails[m].date > date) {
                r = m - 1;
            } else {
                // If we found the right date, look for duplicates that may
                //   occur before or after the current item.
                while (emails[--m].date.getTime() === date.getTime()) {} ;

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

/** Analyses a row of csv or user-given data and adds it's data to the emails array and lookup table. */
function nextMail(mailData: string): Email {
    let tokens = mailData.split(',');
    
    // Make variables for the email's data
    let date = new Date(tokens[0]);
    let fromId = parseInt(tokens[1]);
    let toId = parseInt(tokens[4]);
    let mailType = tokens[7];
    let appreciation = parseFloat(tokens[8]);
    
    let mail = new Email(date, fromId, toId, mailType, appreciation);

    // If the sender is not registered in the lookup table, add them.
    if (!(fromId in lookup)) {
        lookup[fromId] = new Employee(tokens[2], tokens[3]);
    }
    // If the receiver is not registered in the lookup table, add them.
    if (!(toId in lookup)) {
        lookup[toId] = new Employee(tokens[5], tokens[6]);
    }

    // Add the email to the emails array and return the object
    emails.push(mail);
    return mail;
}

/** Process a `.csv` file and add their contents to the `emails` array and lookup table. */
function readCsv(filename: string) {
    let notFirst = false;
    let reader = rd.createInterface(fs.createReadStream(filename));

    // Reads all lines from the csv file *with email data*.
    reader.on("line", (line: string) => {
        if (notFirst) {
            nextMail(line);
        } else {
            notFirst = true;
        }
    })
    
    reader.on("close", ()=> {
        emails.sort((e1, e2) => e1.date.getTime() - e2.date.getTime());

        let mg = new MailGraph(new Date("2000-12-01"), new Date("2000-12-24"));
    })
}

// Example code. Adds an already known file's data
readCsv("./enron-v1.csv");