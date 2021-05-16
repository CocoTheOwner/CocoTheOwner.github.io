export class Email {
    // Constructor creates class letiables and immediately assigns their values.
    constructor (
        date,
        fromId,
        toId,
        mailType,
        appreciation
    ) {}
}

/** A class for employee specifics. */
export class Employee {
    constructor (
        email,
        jobTitle
    ) {}
}

/** Analyses a row of csv or user-given data and adds it's data to the emails array and lookup table. */
export function nextMail(mailData, mailArr, lookup) {
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

/** Process an uploaded `.csv` file and add their contents to the `emails` array and lookup table. */
export function readCsv(csvString, mailArr, lookup) {
    let notFirst = false;
    var lines = csvString.split("\n");
    lines.splice(0, 1);
    if (lines[lines.length - 1].length === 0) {
        lines.splice(lines.length - 1, 1);
    }
    lines.forEach(line => nextMail(line, mailArr, lookup));
    mailArr.sort(function (e1, e2) { return e1.date.getTime() - e2.date.getTime(); });
}