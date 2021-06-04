//a class to store email details
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

//a class to store employee details
export class Employee {
    constructor (
        public email: string,
        public jobTitle: string
    ) {}
}

//Analyses a row of csv or user-given data and adds it's data to the emails array and lookup table
//params:
//  -mailData: the string of data to add
//  -mailArr:  emailArray to add the mail to
//  -lookup:   lookupTable to add the data to
//returns:
//  -email object
function nextMail(mailData: string, mailArr: Email[], lookup: { [id: number]: Employee }) {
    let tokens = mailData.split(',');
    
    // Make variables for the email's data
    let date = new Date(tokens[0]);
    let fromId = parseInt(tokens[1]);
    let toId = parseInt(tokens[4]);
    let mailType = tokens[7];
    let appreciation = parseFloat(tokens[8]);

    //create email object
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
}

//Process csv-file data and add their contents to the emails array and lookup table
//params:
//  -csvString: the data read from a .csv file
//  -mailArr:   emailArray to add the mails to
//  -lookup:    lookupTable to add the data to
//returns: nothing
export function readCsv(csvString: string, mailArr: Email[], lookup: { [id: number]: Employee }, datestrings: string[]) {
    let lines = csvString.split("\n");
    lines.splice(0, 1);             //cut off first line, they are just column names
    while (lines[lines.length - 1].length === 0) {  //remove all emptylines from end
        lines.splice(lines.length - 1, 1);
    }
    
    //parse line by line
    lines.forEach(line => {
        let date = nextMail(line, mailArr, lookup);
    });
    
    mailArr = mailArr.sort(function (e1, e2) { return e1.date.getTime() - e2.date.getTime(); });
    
    let totalMillis = mailArr[mailArr.length - 1].date.getTime() - mailArr[0].date.getTime();

    for (var i = 0; i <= 8; i++) {
        let dateInMillis = mailArr[0].date.getTime() + totalMillis * i / 8;
        datestrings.push(new Date(dateInMillis).toISOString().substr(0, 10));
    }
}