import {Email, readCsv} from "./csvParser";
import {MailGraph} from "./mailGraph";
import cluster from "./clusters";
import { emails } from "./csvData.js";

// function sleep(ms: number) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

class EdgeBundling {
  
  public drawArcs(element: HTMLCanvasElement) {

    let mailArray: Email[] = emails

    // readCsv("../../enron-v1.csv", mailArray, {})
    // await sleep(1000)

    let graph: MailGraph = new MailGraph(mailArray)
    let cl: cluster = new cluster()

    let clustering: number[][] = cl.stoC(graph, 1)

    let links: number[][] = cl.clusterLinks(graph, clustering)
    let clusters : number[] = clustering.map(i => i.length)

    /*const clusters : number[] = [4, 4, 4, 20];
    const links = [
      [1, 4, 69],
      [-1, 6, 20],
      [-1, -1, 10],
      [-1, -1, -1]
    ]*/
    let angles : number[] = [clusters.length];

    // Make sure canvas is reachable
    const canvas = document.getElementById("edgeBundling") as HTMLCanvasElement;
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

    const lineWidthMod = 200
    for (let index = 0; index < links.length; index++){
      let row = links[index]
      let p1Angle = angles[index]
      let p1x = x + r * Math.cos(p1Angle)
      let p1y = y + r * Math.sin(p1Angle)
      for (let jndex = 0; jndex < row.length; jndex++){
        let element = row[jndex]
        if (element === 0 || element === -1){
          continue
        }
        let p2Angle = angles[jndex + 1]
        let p2x = x + r * Math.cos(p2Angle)
        let p2y = y + r * Math.sin(p2Angle)
        
        //https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Circle-trig6.svg/250px-Circle-trig6.svg.png
        

        ctx.lineWidth = element / lineWidthMod
        ctx.strokeStyle = selectColor(angles.length, clusters.length)
        ctx.beginPath();
        ctx.moveTo(p1x, p1y)
        ctx.lineTo(p2x, p2y)
        ctx.closePath();
        ctx.stroke();
      }
    }

    /*
      We now have an array of angles, where they are in order and represent an angle from 0* (right) to the middle of its arc
      We have a list of links that need to connect these angle positions with lines, representing a connection
    */
  }
}

function selectColor(colorNum: number, colors: number){
  if (colors < 1) colors = 1; // defaults to one color - avoid divide by zero
  return "hsl(" + (colorNum * (360 / colors) % 360) + ",100%,50%)";
}

new EdgeBundling().drawArcs(<HTMLCanvasElement> document.getElementById("edgeBundling"))