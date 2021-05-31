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
    const chart = am4core.create("chorddiv", am4charts.ChordDiagram);
    // colors of main characters
    chart.colors.saturation = 0.45;
    chart.colors.step = 3;
    let colors = {
        Rachel: chart.colors.next(),
        Monica: chart.colors.next(),
        Phoebe: chart.colors.next(),
        Ross: chart.colors.next(),
        Joey: chart.colors.next(),
        Chandler: chart.colors.next()
    };
    // data was provided by: https://www.reddit.com/user/notrudedude
    chart.data = [
        // node property fields take data from data items where they are first mentioned, that's
        // why we add empty data items at the beginning and set colors here
        { "from": "Monica", "image": "monica.png", "color": colors.Monica },
        { "from": "Rachel", "image": "rachel.png", "color": colors.Rachel },
        { "from": "Chandler", "image": "chandler.png", "color": colors.Chandler },
        { "from": "Ross", "image": "ross.png", "color": colors.Ross },
        { "from": "Joey", "color": colors.Joey, "image": "joey.png", },
        { "from": "Phoebe", "image": "phoebe.png", "color": colors.Phoebe },
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
    nodeTemplate.readerTitle = "Click to show/hide or drag to rearrange";
    nodeTemplate.showSystemTooltip = true;
    nodeTemplate.propertyFields.fill = "color";
    nodeTemplate.tooltipText = "{name}'s kisses: {total}";
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
    // this adapter makes non-main character nodes to be filled with color of the main character which he/she kissed most
    nodeTemplate.adapter.add("fill", function (fill, target) {
        let node = target;
        let counters = {};
        let mainChar = false;
        node.incomingDataItems.each(function (dataItem) {
            if (colors[dataItem.toName]) {
                mainChar = true;
            }
            if (isNaN(counters[dataItem.fromName])) {
                counters[dataItem.fromName] = dataItem.value;
            }
            else {
                counters[dataItem.fromName] += dataItem.value;
            }
        });
        if (mainChar) {
            return fill;
        }
        let count = 0;
        let color;
        let biggest = 0;
        let biggestName;
        for (var name in counters) {
            if (counters[name] > biggest) {
                biggestName = name;
                biggest = counters[name];
            }
        }
        if (colors[biggestName]) {
            fill = colors[biggestName];
        }
        return fill;
    });
    // link template
    let linkTemplate = chart.links.template;
    linkTemplate.strokeOpacity = 0;
    linkTemplate.fillOpacity = 0.15;
    linkTemplate.tooltipText = "{fromName} & {toName}:{value.value}";
    var hoverState = linkTemplate.states.create("hover");
    hoverState.properties.fillOpacity = 0.7;
    hoverState.properties.strokeOpacity = 0.7;
    // data credit label
    let creditLabel = chart.chartContainer.createChild(am4core.TextLink);
    creditLabel.text = "Data source: notrudedude";
    creditLabel.url = "https://www.reddit.com/user/notrudedude";
    creditLabel.y = am4core.percent(99);
    creditLabel.x = am4core.percent(99);
    creditLabel.horizontalCenter = "right";
    creditLabel.verticalCenter = "bottom";
    let titleImage = chart.chartContainer.createChild(am4core.Image);
    titleImage.href = "//www.amcharts.com/wp-content/uploads/2018/11/whokissed.png";
    titleImage.x = 30;
    titleImage.y = 30;
    titleImage.width = 200;
    titleImage.height = 200;
    exports.default = chart;
});
