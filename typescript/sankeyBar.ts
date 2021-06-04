// plz overwrite with import :)
var data: string[] = [
    "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "monday", "tuesday"
]
var fraction: number[] = [0.2, 0.8]

/// Create the labels underneath the SankeyDiagram
const table = <HTMLTableElement> document.getElementById("sankeylabels")

// Draw the sankey labels
drawSankeyLabels()

// Create a row to append the label to
var row = document.createElement("tr")
row.id = "sankeyLabelsRow"

function drawSankeyLabels(){

    var row_ = document.getElementById("sankeyLabelsRow")
    if (row_ !== null)  {
        table.removeChild(row_)
    }
    row = document.createElement("tr")
    row.id = "sankeyLabelsRow"

    // Iterate over all labels
    for (let i = 0; i <= data.length - 1; i++){

        // Create a table element
        var td = document.createElement("td")

        // Add an arrow up and the date label to the table element
        td.appendChild(document.createTextNode("↑ " + data[i]));

        // Append the element to the row
        row.appendChild(td)
    }

    // Add the row to the table
    table.appendChild(row)
}


/// Draw a progress-like bar underneath the labels to display the current date selection
const canvas = <HTMLCanvasElement> document.getElementById("sankeyCanvas");

// Set the internal pixel width for the bar
canvas.width = 1000

// Magic number that patches an unexplainable rescaling bug
var magic_number = 0.833

// Retrieve CTX from canvas
var ctx = canvas.getContext("2d");

// Draw sankey bar
drawSankeyBar()

function drawSankeyBar(){
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Fill the canvas with a light pink block (the background)
    ctx.fillStyle = "rgb(169, 169, 255)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Fill the selection with a dark purple block (the foreground)
    ctx.fillStyle = "#AB00CC"
    ctx.fillRect(canvas.width * fraction[0] * magic_number, 0, canvas.width * fraction[1] * magic_number, canvas.height)
}

export default function updateData(dates: string[], fractions: number[]) {
    data = dates;
    fraction = fractions;
    drawSankeyLabels()
    drawSankeyBar()
}