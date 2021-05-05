import React from "react"
export default class Canvas extends React.Component {
  
  drawArcs(element: HTMLCanvasElement) {

    const clusters : number[] = [4, 4, 4, 20];
    const links = [
      [1, 4, 69],
      [-1, 6, 20],
      [-1, -1, 10],
      [-1, -1, -1]
    ]
    let angles : number[] = [clusters.length];

    // Make sure canvas is reachable
    const canvas = document.getElementById("visCanv") as HTMLCanvasElement;
    if (canvas == null) {
      console.log("Failed to find canvas for visualisation with the name 'visCanv'");
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
    let elements = 0
    clusters.forEach(c => elements += c)
    console.log("Circle has " + elements + " elements across " + clusters.length + " indices")

    // Angle and color counter
    let angle = 0;
    let colnr = 0;

    // Get position on screen + radius
    const x = canvas.width/2;
    const y = canvas.height/2;
    const r = canvas.height/3;

    // Loop over arc parts and show them
    for (let index = 0; index < clusters.length; index++) {
      
      // Retrieve current element
      const element = clusters[index];

      // Calculate new arc angle
      const newang = angle + element / elements * Math.PI*2;

      // Draw arc
      ctx.beginPath();
      angles[colnr] = (angle + newang) / 2;
      ctx.strokeStyle = selectColor(colnr++, clusters.length);
      ctx.arc(x, y, r, angle, newang);
      ctx.arc(x, y, r, newang, angle, true); // Required to prevent weird loop behaviour
      ctx.closePath();
      ctx.stroke();

      // Log information
      console.log("Drawing (" + x + "/" + y + ") w" + r + " @ " + angle/Math.PI + " to " + newang/Math.PI);

      // Update angle
      angle = newang;
    }

    /*
      We now have an array of angles, where they are in order and represent an angle from 0* (right) to the middle of its arc
      We have a list of links that need to connect these angle positions with lines, representing a connection
    */
  }

  render () {
      return (
      // TODO: Link visualization to div
      // Width and height are currently fixed (do not automatically resize)
      <div style={{border: "1px solid #FFFFFF", width: "1000px", height: "700px", margin:"auto", borderRadius:"25px"}} className="">
        <canvas id="visCanv" width="1000px" height="700px" ref={this.drawArcs}>
          Your browser does not support the HTML5 canvas tag. Please use another browser or our visualisation will not be visible for you.
        </canvas>
      </div>
    );
  }
}

function selectColor(colorNum: number, colors: number){
  if (colors < 1) colors = 1; // defaults to one color - avoid divide by zero
  return "hsl(" + (colorNum * (360 / colors) % 360) + ",100%,50%)";
}