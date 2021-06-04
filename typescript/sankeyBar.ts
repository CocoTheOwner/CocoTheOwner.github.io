const data: string[] = [
    "1", "2", "3", "4", "5", "6", "7", "8", "9"
]
const labels = data.length - 1 // Note that this includes the last label. There should be labels - 1 boxes.
const canvas = <HTMLCanvasElement> document.getElementById("sankeyCanvas");
const table = <HTMLTableElement> document.getElementById("sankeylabels")
const ctx = canvas.getContext("2d");
const tickHeight = 5; // Pixels height of the tick
const textOffsetTick = 5; // Pixels offset of the label compared to the tick bottom
ctx.font = "30px Arial";
ctx.fillStyle = "green"
ctx.fillRect(0, 0, canvas.width, canvas.height)
var pos = 0

var row = document.createElement("tr");
for (let i = 0; i <= labels; i++){
    var td = document.createElement("td")
    td.appendChild(document.createTextNode("↑ " + data[i]));
    data[i]["td"] = td
    row.appendChild(td)
}
table.appendChild(row)

// Draw a label with a tick at the x coord.
function drawLabel(text: string, x: number, ctx: CanvasRenderingContext2D): void {
    var oldStyle = ctx.fillStyle;
    ctx.fillStyle = "black";
    ctx.fillRect(x, 0, x + 3, tickHeight);
    ctx.fillText(text, x, canvas.height - tickHeight - textOffsetTick);
    ctx.fillStyle = oldStyle;
}