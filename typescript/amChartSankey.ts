var am4core = window["am4core"]
var am4charts = window["am4charts"]
var am4themes_animated = window["am4themes_animated"]
const apple = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

export const chart = am4core.create("sankeydiv", am4charts.SankeyDiagram);
chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

chart.data = [
  { from: "A", to: "D", value: apple[0] },
  { from: "B", to: "D", value: apple[1] },
  { from: "B", to: "E", value: apple[2] },
  { from: "C", to: "E", value: apple[3] },
  { from: "D", to: "G", value: apple[4] },
  { from: "D", to: "I", value: apple[5] },
  { from: "D", to: "H", value: apple[6] },
  { from: "E", to: "H", value: apple[7] },    
  { from: "G", to: "J", value: apple[8] },
  { from: "I", to: "J", value: apple[9] }
]

var hoverState = chart.links.template.states.create("hover");
hoverState.properties.fillOpacity = 0.8;

chart.dataFields.fromName = "from";
chart.dataFields.toName = "to";
chart.dataFields.value = "value";
chart.dataFields.color = "nodeColors";

// for right-most label to fit
chart.paddingRight = 150;

// make nodes draggable
var nodeTemplate = chart.nodes.template;
nodeTemplate.inert = true;
nodeTemplate.readerTitle = "Drag me!";
nodeTemplate.showSystemTooltip = true;
nodeTemplate.width = 10;
nodeTemplate.height = 20;
nodeTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer