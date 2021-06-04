// plz overwrite with import :)
var data = [
    "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "monday", "tuesday"
];
/// Create the labels underneath the SankeyDiagram
const table = document.getElementById("sankeylabels");
// Create a row to append the label to
const row = document.createElement("tr");
// Iterate over all labels
for (let i = 0; i <= data.length - 1; i++) {
    // Create a table element
    var td = document.createElement("td");
    // Add an arrow up and the date label to the table element
    td.appendChild(document.createTextNode("↑ " + data[i]));
    // Append the element to the row
    row.appendChild(td);
}
// Add the row to the table
table.appendChild(row);
/// Draw a progress-like bar underneath the labels to display the current date selection
const canvas = document.getElementById("sankeyCanvas");
const ctx = canvas.getContext("2d");
ctx.fillRect(0, 0, canvas.width, canvas.height);
