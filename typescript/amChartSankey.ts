var am4core = window["am4core"]
var am4charts = window["am4charts"]
var am4themes_animated = window["am4themes_animated"]

/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

const chart = am4core.create("sankeydiv", am4charts.SankeyDiagram);
var linkTemplate = chart.links.template;
var nodeTemplate = chart.nodes.template;
chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

chart.data = [
  { from: "A", to: "D", value: 0},
  { from: "B", to: "D", value: 1},
  { from: "B", to: "E", value: 2},
  { from: "C", to: "E", value: 3},
  { from: "D", to: "G", value: 4},
  { from: "D", to: "I", value: 5},
  { from: "D", to: "H", value: 6},
  { from: "E", to: "H", value: 7},    
  { from: "G", to: "J", value: 8},
  { from: "I", to: "J", value: 9}
]

var hoverState = chart.links.template.states.create("hover");
hoverState.properties.fillOpacity = 1;

chart.dataFields.fromName = "from";
chart.dataFields.toName = "to";
chart.dataFields.value = "value";
chart.dataFields.color = "color";

// for right-most label to fit
chart.paddingRight = 150;

/**
 * customize nodes
 */
nodeTemplate.inert = true;
nodeTemplate.draggable = false;
nodeTemplate.hoverable = true;
nodeTemplate.showSystemTooltip = false;
nodeTemplate.width = 10;
nodeTemplate.height = 20;
nodeTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer
nodeTemplate.stroke = am4core.color("#000000"); //should be the same colour of the background
nodeTemplate.strokeOpacity = 1;
nodeTemplate.strokeWidth = 0;
nodeTemplate.cornerRadius = 2;
nodeTemplate.innerCornerRadius = 0;
nodeTemplate.events.off("hit"); // avoid hiding the nodes when you click them

nodeTemplate.events.on("over", function(event){
  event.target.nameLabel.label.disabled = false;
})
nodeTemplate.events.on("out", function(event){
  event.target.nameLabel.label.disabled = true;
})

/**
 * customize links
 */
linkTemplate.tension = 0.7;
linkTemplate.colorMode = "gradient";
linkTemplate.fillOpacity = 0.4;
linkTemplate.strokeOpacity = 1
linkTemplate.strokeWidth = 0

// clicking nodes
nodeTemplate.events.on("hit", function (event) {
  event.target.strokeWidth = (event.target.strokeWidth + 1) % 2
});

linkTemplate.events.on("hit", function (event) {
  event.target.strokeWidth = (event.target.strokeWidth + 1) % 2
});

export default chart