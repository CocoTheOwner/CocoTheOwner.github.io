import React from "react"
export default class Canvas extends React.Component {
  
  drawArcs(element: HTMLCanvasElement) {

    const clusters : number[] = [4, 4, 4, 20];
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

    // Roof
    let angle = 0;

    // Get position on screen + radius
    const x = canvas.width/2;
    const y = canvas.height/2;
    const r = canvas.height/3;

    
    let red = getRandomInt(0, 255);
    let green = getRandomInt(0, 255);
    let blue = getRandomInt(0, 255);

    // Loop over arc parts and show them
    for (let index = 0; index < clusters.length; index++) {
      
      // Retrieve current element
      const element = clusters[index];

      // Calculate new arc angle
      const newang = angle + element / elements * Math.PI*2;

      red = getRandomInt(0, 255)
      green = getRandomInt(0, 255)
      blue = getRandomInt(0, 255)

      // Draw arc
      ctx.beginPath();
      ctx.strokeStyle = "#" + red.toString(16) + green.toString(16) + blue.toString(16);
      ctx.arc(x, y, r, angle, newang);
      ctx.arc(x, y, r, newang, angle, true); // Required to prevent weird loop behaviour
      ctx.closePath();
      ctx.stroke();

      // Log information
      console.log("Drawing (" + x + "/" + y + ") w" + r + " @ " + angle/Math.PI + " to " + newang/Math.PI);

      // Update angle
      angle = newang;
    }
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

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}