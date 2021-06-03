define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var am4core = window["am4core"];
    var am4charts = window["am4charts"];
    var am4themes_animated = window["am4themes_animated"];
    /* Chart code */
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end
    const chart = am4core.create("sankeydiv", am4charts.SankeyDiagram);
    var linkTemplate = chart.links.template;
    var nodeTemplate = chart.nodes.template;
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
    chart.data = [
        { from: "A", to: "D", value: 0 },
        { from: "B", to: "D", value: 1 },
        { from: "B", to: "E", value: 2 },
        { from: "C", to: "E", value: 3 },
        { from: "D", to: "G", value: 4 },
        { from: "D", to: "I", value: 5 },
        { from: "D", to: "H", value: 6 },
        { from: "E", to: "H", value: 7 },
        { from: "G", to: "J", value: 8 },
        { from: "I", to: "J", value: 9 }
    ];
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
    nodeTemplate.readerTitle = "Drag me!";
    nodeTemplate.showSystemTooltip = true;
    nodeTemplate.width = 10;
    nodeTemplate.height = 20;
    nodeTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    nodeTemplate.stroke = am4core.color("#A9A9FF"); //should be the same colour of the background
    nodeTemplate.strokeOpacity = 0.2;
    nodeTemplate.strokeWidth = 1.4;
    nodeTemplate.cornerRadius = 2;
    nodeTemplate.innerCornerRadius = 0;
    nodeTemplate.events.off("hit"); // avoid hiding the nodes when you click them
    /**
     * customize links
     */
    linkTemplate.tension = 0.7;
    linkTemplate.colorMode = "gradient";
    linkTemplate.fillOpacity = 0.2;
    // clicking nodes
    let node;
    nodeTemplate.events.on("hit", function (event) {
        if (node == event.target) {
            node.fill = node.defaultState.properties.fill;
            node = undefined;
        }
        else {
            if (node) {
                node.fill = node.defaultState.properties.fill;
            }
            node = event.target;
            console.log("node " + node.name + " was clicked");
            node.setState("selected");
        }
    });
    // when a node is selected, colour it in red
    var hl = nodeTemplate.states.create("selected");
    hl.properties.fill = am4core.color("#c55");
    // // clicking edges
    // linkTemplate.events.on("hit", function (event) {
    //   let edge = event.target;
    //   console.log("edge " + edge.name + " was clicked");
    //   edge.setAttribute("stroke","#000000");
    //   edge.setAttribute("fill","#000000");
    // });
    exports.default = chart;
});
