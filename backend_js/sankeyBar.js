define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // plz overwrite with import :)
    var data = [
        "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "monday", "tuesday"
    ];
    var fraction = [0.2, 0.8];
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
    canvas.width = 1000;
    var magic_number = 0.833;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgb(169, 169, 255)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#AB00CC";
    ctx.fillRect(canvas.width * fraction[0] * magic_number, 0, canvas.width * fraction[1] * magic_number, canvas.height);
    function updateData(dates) {
        data = dates;
        // fraction = fraction;
    }
    exports.default = updateData;
});
