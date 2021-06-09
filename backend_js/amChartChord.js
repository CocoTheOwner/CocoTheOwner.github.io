define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    chart.nodePadding = 0.5;
    chart.minNodeSize = 0.01;
    chart.startAngle = 0;
    chart.endAngle = chart.startAngle + 180;
    chart.sortBy = "value";
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
        nodeToggle(node);
        let value = nodeGet(node);
        node.outgoingDataItems.each(function (dataItem) { edgeSet(dataItem._link, value); });
        node.incomingDataItems.each(function (dataItem) { edgeSet(dataItem._link, value); });
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
    linkTemplate.tooltipText = "{fromName} sent {toName} {value.value} mails";
    // clicking edges
    window["chord_highlight"] = [];
    linkTemplate.events.on("hit", function (event) {
        edgeToggle(event.target);
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
    function edgeToggle(edge) {
        edge.strokeOpacity = (edge.strokeOpacity + 1) % 2;
    }
    function edgeSet(edge, value) {
        edge.strokeOpacity = value;
    }
    function edgeGet(edge) { return edge.strokeOpacity == 1; }
    function nodeToggle(node) {
        node.slice.strokeOpacity = (node.slice.strokeOpacity + 1) % 2;
    }
    function nodeSet(node, value) {
        node.slice.strokeOpacity = value;
    }
    function nodeGet(node) { return node.slice.strokeOpacity == 1; }
    exports.default = chart;
});
