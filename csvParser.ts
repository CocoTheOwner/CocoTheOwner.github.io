import * as fs from 'fs';
import * as rd from 'readline';


// let emails: Array<Email> = [];                  // Array for all emails' details, except for employee specifics
// let lookup: { [id: number]: Employee } = {};    // Dictionary for all employees' specifics with their ID as key


/** A class for email data with light employee data. */
export class Email {
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

/** Analyses a row of csv or user-given data and adds it's data to the emails array and lookup table. */
export function nextMail(mailData: string, mailArr: Email[], lookup: { [id: number]: Employee }): Email {
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
    mailArr.push(mail);
    return mail;
}

/** Process a `.csv` file and add their contents to the `emails` array and lookup table. */
export function readCsv(filename: string, mailArr: Email[], lookup: { [id: number]: Employee }) {
    let notFirst = false;
    let reader = rd.createInterface(fs.createReadStream(filename));

    // Reads all lines from the csv file *with email data*.
    reader.on("line", (line: string) => {
        if (notFirst) {
            nextMail(line, mailArr, lookup);
        } else {
            notFirst = true;
        }
    })
    
    reader.on("close", ()=> {
        mailArr.sort((e1, e2) => e1.date.getTime() - e2.date.getTime());
    })
}