import sankeyChart from "./amChartSankey";

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

        // If this is the first time we see this job title, assign it a color
        if (window["colorData"][tokens[3]] === undefined) {
            window["colorData"][tokens[3]] = sankeyChart.colors.next();
        }
    }

    // If the receiver is not registered in the lookup table, add them.
    if (!(toId in lookup)) {
        lookup[toId] = new Employee(tokens[5], tokens[6]);

        // If this is the first time we see this job title, assign it a color
        if (window["colorData"][tokens[6]] === undefined) {
            window["colorData"][tokens[6]] = sankeyChart.colors.next();
        }
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
export function readCsv(csvString: string, mailArr: Email[], lookup: { [id: number]: Employee }) {
    let lines = csvString.split("\n");
    let columns = lines.splice(0, 1)[0].trim();             //cut off first line, they are just column names
    
    if (!(columns === "date,fromId,fromEmail,fromJobtitle,toId,toEmail,toJobtitle,messageType,sentiment")) {
        alert("The data you're trying to upload does not match the accepted format. Please select another document.")
    }

    while (lines[lines.length - 1].length === 0) {  //remove all emptylines from end
        lines.splice(lines.length - 1, 1);
    }
    
    //parse line by line
    lines.forEach(line => {
        let date = nextMail(line, mailArr, lookup);
    });
    
    mailArr = mailArr.sort(function (e1, e2) { return e1.date.getTime() - e2.date.getTime(); });

    
    let s = mailArr[0].date
    let e = mailArr[mailArr.length - 1].date

    window["startDate"] = s;
    window["endDate"] = e;
    
    window['dataStartDate'] = s.getFullYear()  + "/" + (s.getMonth()+1) + "/" + s.getDate()
    window['dataEndDate'] = e.getFullYear()  + "/" + (e.getMonth()+1) + "/" + e.getDate()
}