import * as fs from 'fs';
import * as rd from 'readline';

var reader = rd.createInterface(fs.createReadStream("./enron-v1.csv"));
var emails: Array<Email> = [];
var lookup: { [id: number]: Employee } = {};


class Email {
    // Constructor creates class variables and immediately assigns their values.
    constructor (
        public date: Date,
        public fromId: number,
        public toId: number,
        public mailType: string,
        public appreciation: number
    ) {}
}
    
class Employee {
    constructor (
        public email: string,
        public jobTitle: string
    ) {}
}
        
class MailGroup {
    count: number = 0;
    appreciations: number[] = [];

    add (appreciation: number) {
        this.appreciations[this.count++] = appreciation;
    }
}

class MailGraph {
    private graph: { [fId: number]: {[tId: number]: MailGroup} } = {};

    // Add a new edge to the graph.
    // If any one of the required nodes is missing, they are added.
    addMail(mail: Email) {
        if (!(mail.fromId in this.graph)) {
            this.graph[mail.fromId] = {};
        }
        if (!(mail.toId in this.graph[mail.fromId])) {
            this.graph[mail.fromId][mail.toId] = new MailGroup();
        }

        this.graph[mail.fromId][mail.toId].add(mail.appreciation);
    }

    // Yet to be defined
    distance (from: number, to: number): number {
        return 10;
    }
}

/** Analyses a row of csv or user-given data and adds it's data to the emails array and lookup table. */
function nextMail(mailData: string): Email {
    var tokens = mailData.split(',');
    
    var date = new Date(tokens[0]);
    var fromId = parseInt(tokens[1]);

    if (Number.isNaN(fromId)) {
        return;
    }

    var toId = parseInt(tokens[4]);
    var mailType = tokens[7];
    var appreciation = parseFloat(tokens[8]);
    
    emails.push(new Email(date, fromId, toId, mailType, appreciation));

    if (!(fromId in lookup)) {
        lookup[fromId] = new Employee(tokens[2], tokens[3]);
    }
    if (!(toId in lookup)) {
        lookup[toId] = new Employee(tokens[5], tokens[6]);
    }
}

// Create a Graph object for all correspondence in a timeframe.
function createGraph(startIndex: number, endIndex: number): MailGraph {
    var G: MailGraph = new MailGraph();

    while (startIndex < endIndex) {
        var mail = emails[startIndex++];
        G.addMail(mail);
    }

    return G;
}

// Reads all lines from a csv file with email data.
reader.on("line", (line: string) => {
    nextMail(line);
})

reader.on("close", ()=> {
    emails.sort((e1, e2) => e1.date.getTime() - e2.date.getTime());

    emails.forEach((mail) => {
        console.log(`${mail.date}, ${mail.mailType}`);
    });

    // console.log(`${emails[0].date <= emails[1].date}`);
})


// Find neighbours:
//  Employee -> Mails sent (To who, how many, average appreciation)