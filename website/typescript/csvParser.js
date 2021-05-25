"use strict";
exports.__esModule = true;
exports.readCsv = exports.nextMail = exports.Employee = exports.Email = void 0;
//a class to store email details
var Email = /** @class */ (function () {
    // Constructor creates class letiables and immediately assigns their values.
    function Email(date, fromId, toId, mailType, appreciation) {
        this.date = date;
        this.fromId = fromId;
        this.toId = toId;
        this.mailType = mailType;
        this.appreciation = appreciation;
    }
    return Email;
}());
exports.Email = Email;
//a class to store employee details
var Employee = /** @class */ (function () {
    function Employee(email, jobTitle) {
        this.email = email;
        this.jobTitle = jobTitle;
    }
    return Employee;
}());
exports.Employee = Employee;
//Analyses a row of csv or user-given data and adds it's data to the emails array and lookup table
//params:
//  -mailData: the string of data to add
//  -mailArr:  emailArray to add the mail to
//  -lookup:   lookupTable to add the data to
//returns:
//  -email object
function nextMail(mailData, mailArr, lookup) {
    var tokens = mailData.split(',');
    // Make variables for the email's data
    var date = new Date(tokens[0]);
    var fromId = parseInt(tokens[1]);
    var toId = parseInt(tokens[4]);
    var mailType = tokens[7];
    var appreciation = parseFloat(tokens[8]);
    //create email object
    var mail = new Email(date, fromId, toId, mailType, appreciation);
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
exports.nextMail = nextMail;
//Process csv-file data and add their contents to the emails array and lookup table
//params:
//  -csvString: the data read from a .csv file
//  -mailArr:   emailArray to add the mails to
//  -lookup:    lookupTable to add the data to
//returns: nothing
function readCsv(csvString, mailArr, lookup) {
    var lines = csvString.split("\n");
    lines.splice(0, 1); //cut off first line, they are just column names
    while (lines[lines.length - 1].length === 0) { //remove all emptylines from end
        lines.splice(lines.length - 1, 1);
    }
    lines.forEach(function (line) { return nextMail(line, mailArr, lookup); }); //parse line by line
    mailArr.sort(function (e1, e2) { return e1.date.getTime() - e2.date.getTime(); });
}
exports.readCsv = readCsv;
