"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mailGraph_1 = require("./mailGraph");
var clusters_1 = require("./clusters");
var csvData_js_1 = require("./csvData.js");
// function sleep(ms: number) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }
var EdgeBundling = /** @class */ (function () {
    function EdgeBundling() {
    }
    EdgeBundling.prototype.drawArcs = function (element) {
        var mailArray = csvData_js_1.emails;
        // readCsv("../../enron-v1.csv", mailArray, {})
        // await sleep(1000)
        var graph = new mailGraph_1.MailGraph(mailArray);
        var cl = new clusters_1.default();
        var clustering = cl.stoC(graph, 1);
        var links = cl.clusterLinks(graph, clustering);
        var clusters = clustering.map(function (i) { return i.length; });
        /*const clusters : number[] = [4, 4, 4, 20];
        const links = [
          [1, 4, 69],
          [-1, 6, 20],
          [-1, -1, 10],
          [-1, -1, -1]
        ]*/
        var angles = [clusters.length];
        // Make sure canvas is reachable
        var canvas = document.getElementById("edgeBundling");
        if (canvas == null) {
            console.log("Failed to find canvas for visualisation with the name 'visCanv'");
            return;
        }
        var ctx = canvas.getContext("2d");
        if (ctx == null) {
            console.log("Failed to get context from canvas.");
            return;
        }
        // Set line width
        ctx.lineWidth = 10;
        // Retrieve amount of elements that were clustered
        var elements = 0;
        clusters.forEach(function (c) { return elements += c; });
        console.log("Circle has " + elements + " elements across " + clusters.length + " indices");
        // Angle and color counter
        var angle = 0;
        var colnr = 0;
        // Get position on screen + radius
        var x = canvas.width / 2;
        var y = canvas.height / 2;
        var r = canvas.height / 3;
        // Loop over arc parts and show them
        for (var index = 0; index < clusters.length; index++) {
            // Retrieve current element
            var element_1 = clusters[index];
            // Calculate new arc angle
            var newang = angle + element_1 / elements * Math.PI * 2;
            // Draw arc
            ctx.beginPath();
            angles[colnr] = (angle + newang) / 2;
            ctx.strokeStyle = selectColor(colnr++, clusters.length);
            ctx.arc(x, y, r, angle, newang);
            ctx.arc(x, y, r, newang, angle, true); // Required to prevent weird loop behaviour
            ctx.closePath();
            ctx.stroke();
            // Log information
            console.log("Drawing (" + x + "/" + y + ") w" + r + " @ " + angle / Math.PI + " to " + newang / Math.PI);
            // Update angle
            angle = newang;
        }
        var lineWidthMod = 200;
        for (var index = 0; index < links.length; index++) {
            var row = links[index];
            var p1Angle = angles[index];
            var p1x = x + r * Math.cos(p1Angle);
            var p1y = y + r * Math.sin(p1Angle);
            for (var jndex = 0; jndex < row.length; jndex++) {
                var element_2 = row[jndex];
                if (element_2 === 0 || element_2 === -1) {
                    continue;
                }
                var p2Angle = angles[jndex + 1];
                var p2x = x + r * Math.cos(p2Angle);
                var p2y = y + r * Math.sin(p2Angle);
                //https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Circle-trig6.svg/250px-Circle-trig6.svg.png
                ctx.lineWidth = element_2 / lineWidthMod;
                ctx.strokeStyle = selectColor(angles.length, clusters.length);
                ctx.beginPath();
                ctx.moveTo(p1x, p1y);
                ctx.lineTo(p2x, p2y);
                ctx.closePath();
                ctx.stroke();
            }
        }
        /*
          We now have an array of angles, where they are in order and represent an angle from 0* (right) to the middle of its arc
          We have a list of links that need to connect these angle positions with lines, representing a connection
        */
    };
    return EdgeBundling;
}());
function selectColor(colorNum, colors) {
    if (colors < 1)
        colors = 1; // defaults to one color - avoid divide by zero
    return "hsl(" + (colorNum * (360 / colors) % 360) + ",100%,50%)";
}
new EdgeBundling().drawArcs(document.getElementById("edgeBundling"));
