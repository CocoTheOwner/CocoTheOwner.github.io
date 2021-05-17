"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var rd = require("readline");
var emails = []; // Array for all emails' details, except for employee specifics
var lookup = {}; // Dictionary for all employees' specifics with their ID as key
/** A class for email data with light employee data. */
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
/** A class for employee specifics. */
var Employee = /** @class */ (function () {
    function Employee(email, jobTitle) {
        this.email = email;
        this.jobTitle = jobTitle;
    }
    return Employee;
}());
/** A class representing a directed graph for email traffic. */
var MailGraph = /** @class */ (function () {
    /**
     * Create a new graph based on an interval between two dates.
     * If any one of the indices is not given, we assume the beginning/end of time.
     *
     * Please remember that the `to` time is _exclusive_. E-mails from this day are **not** added.
    */
    function MailGraph(from, to) {
        if (from === void 0) { from = new Date(0); }
        if (to === void 0) { to = new Date(1); }
        this.graph = {};
        var startIndex = findTimeIndex(from);
        var endIndex = findTimeIndex(to);
        // Loop through all emails in the interval
        while (startIndex < endIndex) {
            var mail = emails[startIndex++];
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
    MailGraph.prototype.addMail = function (mail) {
        this.graph[mail.fromId][mail.toId].push(mail.appreciation);
    };
    // Yet to be defined
    MailGraph.prototype.distance = function (from, to) {
        return 10;
    };
    MailGraph.prototype.copynodes = function () {
        return Object.keys(this.graph);
    };
    MailGraph.prototype.neighbours = function (node) {
        return Object.keys(this.graph[node]);
    };
    return MailGraph;
}());
/**
 * Finds the index of the first or last mail sent on the specified date, based on whether we look on the low end or the high end.
 * If no such date exists, the index of the date right after what we looked for is returned.
 * lowEnd does not have to be specified. If it isn't, default value `true` will be used.
 *
 * Two special cases are included for returning the first and last index of the array:
 * ```let i1 = findTimeIndex(new Date(0));  // Returns 0```
 * ```let i2 = findTimeIndex(new Date(1));  // Returns emails.length```
*/
function findTimeIndex(date) {
    if (date.getTime() === 0) { // Special case: Return the first element of the array
        return 0;
    }
    else if (date.getTime() === 1) { // Special case: Return the last element of the array
        return emails.length;
    }
    else { // Normal case: Perform binary search to find the correct indices.
        var l = 0;
        var r = emails.length - 1;
        // While true, keep searching
        while (l <= r) {
            var m = Math.floor((l + r) / 2);
            if (emails[m].date < date) {
                l = m + 1;
            }
            else if (emails[m].date > date) {
                r = m - 1;
            }
            else {
                // If we found the right date, look for duplicates that may
                //   occur before or after the current item.
                while (emails[--m].date.getTime() === date.getTime()) { }
                ;
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
function nextMail(mailData) {
    var tokens = mailData.split(',');
    // Make variables for the email's data
    var date = new Date(tokens[0]);
    var fromId = parseInt(tokens[1]);
    var toId = parseInt(tokens[4]);
    var mailType = tokens[7];
    var appreciation = parseFloat(tokens[8]);
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
    emails.push(mail);
    return mail;
}
/** Process a `.csv` file and add their contents to the `emails` array and lookup table. */
function readCsv(filename) {
    var notFirst = false;
    var reader = rd.createInterface(fs.createReadStream(filename));
    // Reads all lines from the csv file *with email data*.
    reader.on("line", function (line) {
        if (notFirst) {
            nextMail(line);
        }
        else {
            notFirst = true;
        }
    });
    reader.on("close", function () {
        emails.sort(function (e1, e2) { return e1.date.getTime() - e2.date.getTime(); });
        var mg = new MailGraph(new Date("2000-12-01"), new Date("2000-12-24"));
    });
}
// Example code. Adds an already known file's data
readCsv("./enron-v1.csv");
