define(["require", "exports", "./mailGraph", "./clusters", "./csvData"], function (require, exports, mailGraph_1, clusters_1, csvData_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class EdgeBundling {
        //draws the visualization on the screen
        //params:
        //  -canvas: the canvas to draw on
        //returns: nothing
        drawArcs(canvas) {
            let mailArray = csvData_1.emails; //use preprocessed mailarry for now
            //all backend calculating
            let graph = new mailGraph_1.MailGraph(mailArray);
            let cl = new clusters_1.default();
            let clustering = cl.stoC(graph, 1);
            let links = cl.clusterLinks(graph, clustering);
            let clusters = clustering.map(i => i.length); //array of cluster sizes
            //array of angles where center of a cluster is, used to draw the lines
            let angles = [];
            // Make sure canvas is reachable
            if (canvas == null) {
                console.log("Failed to find canvas for visualisation");
                return;
            }
            const ctx = canvas.getContext("2d");
            if (ctx == null) {
                console.log("Failed to get context from canvas.");
                return;
            }
            // Set line width
            ctx.lineWidth = 10;
            // Retrieve amount of elements that were clustered
            let elements = clusters.reduce((a, b) => a + b);
            console.log("Circle has " + elements + " elements across " + clusters.length + " indices");
            //angle to draw arcs
            let startAngle = 0;
            // Get position on screen + radius
            const x = canvas.width / 2;
            const y = canvas.height / 2;
            const r = canvas.height / 3;
            // Loop over arc parts and show them
            for (let i = 0; i < clusters.length; i++) {
                // Retrieve current element
                const element = clusters[i];
                // Calculate arc endPoint
                const endAngle = startAngle + (element / elements) * Math.PI * 2;
                //store cluster center
                angles[i] = (startAngle + endAngle) / 2;
                // Draw arc
                ctx.beginPath();
                ctx.strokeStyle = selectColor(i, clusters.length);
                ctx.arc(x, y, r, startAngle, endAngle);
                ctx.arc(x, y, r, endAngle, startAngle, true); // Required to prevent weird loop behaviour
                ctx.closePath();
                ctx.stroke();
                // Log information
                //console.log("Drawing (" + x + "/" + y + ") w" + r + " @ " + startAngle + " to " + endAngle);
                // Update angle
                startAngle = endAngle;
            }
            //draw lines between clusters
            const lineWidthMod = 200;
            for (let i = 0; i < links.length; i++) {
                let row = links[i];
                let p1Angle = angles[i];
                let p1x = x + r * Math.cos(p1Angle);
                let p1y = y + r * Math.sin(p1Angle);
                for (let j = i + 1; j < row.length; j++) {
                    let element = row[j];
                    if (element === 0 || element === -1) {
                        continue;
                    } //skip over lines that dont need to be drawn
                    let p2Angle = angles[j];
                    let p2x = x + r * Math.cos(p2Angle);
                    let p2y = y + r * Math.sin(p2Angle);
                    //https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Circle-trig6.svg/250px-Circle-trig6.svg.png
                    //draw line
                    ctx.lineWidth = element / lineWidthMod;
                    ctx.strokeStyle = selectColor(angles.length, clusters.length);
                    ctx.beginPath();
                    ctx.moveTo(p1x, p1y);
                    ctx.lineTo(p2x, p2y);
                    ctx.closePath();
                    ctx.stroke();
                }
            }
        }
    }
    //select a color to make a beautiful rainbow :)
    //params:
    //  -colorNum: how far on the rainbow are we
    //  -colors:   how many diffrent colors in this rainbow
    //returns:
    //  -string whith hsl color code
    function selectColor(colorNum, colors) {
        if (colors < 1)
            colors = 1; // defaults to one color - avoid divide by zero
        return "hsl(" + (colorNum * (360 / colors) % 360) + ",100%,50%)";
    }
    //call the function to actually run the code
    new EdgeBundling().drawArcs(document.getElementById("edgeBundling"));
});
