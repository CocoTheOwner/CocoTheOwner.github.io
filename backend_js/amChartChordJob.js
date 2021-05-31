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
    const chart = am4core.create("chordjobdiv", am4charts.ChordDiagram);
    chart.data = defaultData;
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
    // when rolled over the node, make all the links rolled-over
    nodeTemplate.events.on("over", function (event) {
        let node = event.target;
        node.outgoingDataItems.each(function (dataItem) {
            if (dataItem.toNode) {
                dataItem.link.isHover = true;
                dataItem.toNode.isHover = true;
            }
        });
        node.incomingDataItems.each(function (dataItem) {
            if (dataItem.fromNode) {
                dataItem.link.isHover = true;
                dataItem.fromNode.label.isHover = true;
            }
        });
        node.label.isHover = true;
    });
    // when rolled out from the node, make all the links rolled-out
    nodeTemplate.events.on("out", function (event) {
        let node = event.target;
        node.outgoingDataItems.each(function (dataItem) {
            if (dataItem.toNode) {
                dataItem.link.isHover = false;
                dataItem.toNode.isHover = false;
            }
        });
        node.incomingDataItems.each(function (dataItem) {
            if (dataItem.fromNode) {
                dataItem.link.isHover = false;
                dataItem.fromNode.label.isHover = false;
            }
        });
        node.label.isHover = false;
    });
    let label = nodeTemplate.label;
    label.relativeRotation = 90;
    label.fillOpacity = 0.4;
    let labelHS = label.states.create("hover");
    labelHS.properties.fillOpacity = 1;
    nodeTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    // link template
    let linkTemplate = chart.links.template;
    linkTemplate.strokeOpacity = 0;
    linkTemplate.fillOpacity = 0.15;
    linkTemplate.tooltipText = "{fromName} & {toName}:{value.value}";
    var hoverState = linkTemplate.states.create("hover");
    hoverState.properties.fillOpacity = 0.7;
    hoverState.properties.strokeOpacity = 0.7;
    chart.events.on('datavalidated', function () {
        chart.setVisibility(false);
    });
    exports.default = chart;
});
