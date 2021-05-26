define(["require", "exports", "./testdata"], function (require, exports, testdata_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var am4core = window["am4core"];
    var am4charts = window["am4charts"];
    var am4themes_animated = window["am4themes_animated"];
    /* Chart code */
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end
    var chart = am4core.create("sankeydiv", am4charts.SankeyDiagram);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
    chart.data = [
        { from: "A", to: "D", value: testdata_1.default[0] },
        { from: "B", to: "D", value: testdata_1.default[1] },
        { from: "B", to: "E", value: testdata_1.default[2] },
        { from: "C", to: "E", value: testdata_1.default[3] },
        { from: "D", to: "G", value: testdata_1.default[4] },
        { from: "D", to: "I", value: testdata_1.default[5] },
        { from: "D", to: "H", value: testdata_1.default[6] },
        { from: "E", to: "H", value: testdata_1.default[7] },
        { from: "G", to: "J", value: testdata_1.default[8] },
        { from: "I", to: "J", value: testdata_1.default[9] }
    ];
    var hoverState = chart.links.template.states.create("hover");
    hoverState.properties.fillOpacity = 0.6;
    chart.dataFields.fromName = "from";
    chart.dataFields.toName = "to";
    chart.dataFields.value = "value";
    // for right-most label to fit
    chart.paddingRight = 30;
    // make nodes draggable
    var nodeTemplate = chart.nodes.template;
    nodeTemplate.inert = true;
    nodeTemplate.readerTitle = "Drag me!";
    nodeTemplate.showSystemTooltip = true;
    nodeTemplate.width = 20;
    // make nodes draggable
    var nodeTemplate = chart.nodes.template;
    nodeTemplate.readerTitle = "Click to show/hide or drag to rearrange";
    nodeTemplate.showSystemTooltip = true;
    nodeTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer;
});
