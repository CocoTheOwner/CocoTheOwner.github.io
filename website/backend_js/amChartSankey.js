define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.chart = void 0;
    var am4core = window["am4core"];
    var am4charts = window["am4charts"];
    var am4themes_animated = window["am4themes_animated"];
    const apple = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    /* Chart code */
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end
    exports.chart = am4core.create("sankeydiv", am4charts.SankeyDiagram);
    exports.chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
    exports.chart.data = [
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
    ];
    var hoverState = exports.chart.links.template.states.create("hover");
    hoverState.properties.fillOpacity = 0.8;
    exports.chart.dataFields.fromName = "from";
    exports.chart.dataFields.toName = "to";
    exports.chart.dataFields.value = "value";
    exports.chart.dataFields.color = "nodeColors";
    // for right-most label to fit
    exports.chart.paddingRight = 150;
    // make nodes draggable
    var nodeTemplate = exports.chart.nodes.template;
    nodeTemplate.inert = true;
    nodeTemplate.readerTitle = "Drag me!";
    nodeTemplate.showSystemTooltip = true;
    nodeTemplate.width = 10;
    nodeTemplate.height = 20;
    // make nodes draggable
    var nodeTemplate = exports.chart.nodes.template;
    nodeTemplate.readerTitle = "Click to show/hide or drag to rearrange";
    nodeTemplate.showSystemTooltip = true;
    nodeTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer;
});
