define(["require", "exports", "./visualisationController", "./amChartSankey"], function (require, exports, visualisationController_1, amChartSankey_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.select = exports.deselect = void 0;
    var am4core = window["am4core"];
    var am4charts = window["am4charts"];
    var am4themes_animated = window["am4themes_animated"];
    const defaultData = [
        // real data
        { "from": "Monica", "to": "Rachel", "value": 4 },
        { "from": "Monica", "to": "Chandler", "value": 113 },
        { "from": "Monica", "to": "Ross", "value": 16 },
        { "from": "Monica", "to": "Joey", "value": 9 },
        { "from": "Monica", "to": "Phoebe", "value": 3 },
        { "from": "Monica", "to": "Paul the wine guy", "value": 1 },
        { "from": "Monica", "to": "Mr Geller", "value": 6 },
        { "from": "Monica", "to": "Mrs Geller", "value": 5 },
        { "from": "Monica", "to": "Aunt Lilian", "value": 1 },
        { "from": "Monica", "to": "Nana", "value": 1 },
        { "from": "Monica", "to": "Young Ethan", "value": 5 },
        { "from": "Monica", "to": "Ben", "value": 3 },
        { "from": "Monica", "to": "Fun Bobby", "value": 3 },
        { "from": "Monica", "to": "Richard", "value": 16 },
        { "from": "Monica", "to": "Mrs Green", "value": 1 },
        { "from": "Monica", "to": "Paolo2", "value": 1 },
        { "from": "Monica", "to": "Pete", "value": 10 },
        { "from": "Monica", "to": "Chip", "value": 1 },
        { "from": "Monica", "to": "Timothy (Burke)", "value": 1 },
        { "from": "Monica", "to": "Emily", "value": 1 },
        { "from": "Monica", "to": "Dr. Roger", "value": 3 },
        { "from": "Rachel", "to": "Chandler", "value": 7 },
        { "from": "Rachel", "to": "Ross", "value": 80 },
        { "from": "Rachel", "to": "Joey", "value": 30 },
        { "from": "Rachel", "to": "Phoebe", "value": 6 },
        { "from": "Rachel", "to": "Paolo", "value": 5 },
        { "from": "Rachel", "to": "Mr Geller", "value": 2 },
        { "from": "Rachel", "to": "Mrs Geller", "value": 1 },
        { "from": "Rachel", "to": "Barry", "value": 1 },
        { "from": "Rachel", "to": "Dr Green", "value": 3 },
        { "from": "Rachel", "to": "Mark3", "value": 1 },
        { "from": "Rachel", "to": "Josh", "value": 2 },
        { "from": "Rachel", "to": "Gunther", "value": 1 }
    ];
    /* Chart code */
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end
    const chart = am4core.create("chorddiv", am4charts.ChordDiagram);
    chart.data = defaultData;
    let link = chart.links.template;
    link.colorMode = "gradient";
    link.fillOpacity = 0.5;
    // colors of main characters
    chart.colors.saturation = 0.45;
    chart.colors.step = 3;
    chart.dataFields.fromName = "from";
    chart.dataFields.toName = "to";
    chart.dataFields.value = "value";
    chart.dataFields.sentiment = "sentiment";
    chart.nodePadding = 0.5;
    chart.minNodeSize = 0.01;
    chart.startAngle = 0;
    chart.endAngle = chart.startAngle + 180;
    chart.sortBy = "none";
    chart.fontSize = 10;
    var nodeTemplate = chart.nodes.template;
    nodeTemplate.readerTitle = "Click to select this job";
    nodeTemplate.showSystemTooltip = true;
    nodeTemplate.propertyFields.fill = "color";
    nodeTemplate.tooltipText = "{name} sent {total} mails.";
    nodeTemplate.draggable = false;
    // avoid hiding the edge when you click on it
    nodeTemplate.events.off("hit");
    nodeTemplate.events.on("hit", function (event) {
        let node = event.target;
        deselect();
        amChartSankey_1.deselect();
        if (window["selectedJob"] != node.name) {
            select(node.name);
            amChartSankey_1.select(node.name);
            window["selectedJob"] = node.name;
        }
        else {
            window["selectedJob"] = "";
        }
        visualisationController_1.updateJobChord();
    });
    let label = nodeTemplate.label;
    label.relativeRotation = 90;
    label.fillOpacity = 0.4;
    let labelSelected = label.states.create("selected");
    labelSelected.properties.fillOpacity = 1;
    nodeTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    // customize edges
    let linkTemplate = chart.links.template;
    linkTemplate.strokeOpacity = 0;
    linkTemplate.fillOpacity = 0.4;
    linkTemplate.tooltipText = "{fromName} and {toName} exchanged {value.value} mails\navg. sentiment: {sentiment}";
    // clicking edges
    window["chord_highlight"] = [];
    linkTemplate.events.on("hit", function (event) {
        //nope
    });
    var selectedState = linkTemplate.states.create("selected");
    selectedState.properties.fillOpacity = 1;
    selectedState.properties.strokeOpacity = 1;
    // adding some customization to the edge of the circle
    // (can be deleted if you don't like it)
    var slice = chart.nodes.template.slice;
    slice.stroke = am4core.color("#000");
    slice.strokeOpacity = 0;
    slice.strokeWidth = 1;
    slice.cornerRadius = 8;
    slice.innerCornerRadius = 0;
    function deselect() {
        chart.nodes.each(function (_, node) {
            node.slice.strokeOpacity = 0;
            node.outgoingDataItems.each(function (dataItem) { dataItem.link.strokeOpacity = 0; });
        });
    }
    exports.deselect = deselect;
    function select(nodeName) {
        chart.nodes.each(function (name, node) {
            if (name == nodeName) {
                node.slice.strokeOpacity = 1;
                node.outgoingDataItems.each(function (dataItem) { dataItem.link.strokeOpacity = 1; });
                node.incomingDataItems.each(function (dataItem) { dataItem.link.strokeOpacity = 1; });
            }
        });
    }
    exports.select = select;
    exports.default = chart;
});
