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
    // Draw the sankey labels
    drawSankeyLabels();
    // Create a row to append the label to
    var row = document.createElement("tr");
    row.id = "sankeyLabelsRow";
    function drawSankeyLabels() {
        var row_ = document.getElementById("sankeyLabelsRow");
        if (row_ !== null) {
            table.removeChild(row_);
        }
        row = document.createElement("tr");
        row.id = "sankeyLabelsRow";
        // Iterate over all labels
        for (let i = 0; i <= data.length - 1; i++) {
            // Create a table element
            var td = document.createElement("td");
            // Add an arrow up and the date label to the table element
            td.appendChild(document.createTextNode("↓ " + data[i]));
            // Append the element to the row
            row.appendChild(td);
        }
        // Add the row to the table
        table.appendChild(row);
    }
    /// Draw a progress-like bar underneath the labels to display the current date selection
    const canvas = document.getElementById("sankeyCanvas");
    // Set the internal pixel width for the bar
    canvas.width = 1000;
    canvas.height = 15;
    // Magic number that patches an unexplainable rescaling bug
    var magic_number = 0.833;
    // Retrieve CTX from canvas
    var ctx = canvas.getContext("2d");
    // Draw sankey bar
    drawSankeyBar();
    function drawSankeyBar() {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Fill the canvas with a light pink block (the background)
        ctx.fillStyle = "rgb(169, 169, 255)";
        roundRect(ctx, 0, 0, canvas.width, canvas.height, 7.5, true, false);
        // Fill the selection with a dark purple block (the foreground)
        ctx.fillStyle = "#AB00CC";
        roundRect(ctx, canvas.width * fraction[0] * magic_number, 0, canvas.width * fraction[1] * magic_number, canvas.height, 7.5, true, false);
    }
    function updateData(fractions = fraction, dates = data) {
        data = dates;
        fraction = fractions;
        drawSankeyLabels();
        drawSankeyBar();
        console.log("RAN WHOOOO");
        console.log(fractions);
    }
    exports.default = updateData;
    /**
     * Full credits for the function go to Juan Mendes, who gave this as an answer on StackOverflow
     * Draws a rounded rectangle using the current state of the canvas.
     * If you omit the last three params, it will draw a rectangle
     * outline with a 5 pixel border radius
     * @param {CanvasRenderingContext2D} ctx
     * @param {Number} x The top left x coordinate
     * @param {Number} y The top left y coordinate
     * @param {Number} width The width of the rectangle
     * @param {Number} height The height of the rectangle
     * @param {Number} [radius = 5] The corner radius; It can also be an object
     *                 to specify different radii for corners
     * @param {Number} [radius.tl = 0] Top left
     * @param {Number} [radius.tr = 0] Top right
     * @param {Number} [radius.br = 0] Bottom right
     * @param {Number} [radius.bl = 0] Bottom left
     * @param {Boolean} [fill = false] Whether to fill the rectangle.
     * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
     */
    function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
        if (typeof stroke === 'undefined') {
            stroke = true;
        }
        if (typeof radius === 'undefined') {
            radius = 5;
        }
        if (typeof radius === 'number') {
            radius = { tl: radius, tr: radius, br: radius, bl: radius };
        }
        else {
            var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
            for (var side in defaultRadius) {
                radius[side] = radius[side] || defaultRadius[side];
            }
        }
        ctx.beginPath();
        ctx.moveTo(x + radius.tl, y);
        ctx.lineTo(x + width - radius.tr, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        ctx.lineTo(x + width, y + height - radius.br);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        ctx.lineTo(x + radius.bl, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
        ctx.closePath();
        if (fill) {
            ctx.fill();
        }
        if (stroke) {
            ctx.stroke();
        }
    }
});
