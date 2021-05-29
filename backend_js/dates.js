// import {emails} from "../typescript/csvData"
// console.log(emails);
var start = localStorage.getItem('startDate');
var end = localStorage.getItem('endDate');
console.log('New date range selected: from ' + start + ' to ' + end);
localStorage.clear();
// document.getElementById("p").innerHTML = start;
// MOVE TO OTHER FILE SO WE CAN BURN THIS ONE (it's not bad!!!! It's just not needed with the new solution)
function getCalendarDates() {
    // Get the two date strings for the MailGraph
    let dateStrings = document.getElementById("calendar").value.split(" - ");
    // This code should definitely build a MailGraph instead!
    let dates = [];
    dates.push(new Date(dateStrings[0]));
    dates.push(new Date(dateStrings[1]));
    // Do we really want a return? I think passing to this function by reference would be better.
    return dates;
}
