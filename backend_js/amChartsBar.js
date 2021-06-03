var am4core = window["am4core"];
var am4charts = window["am4charts"];
var am4themes_animated = window["am4themes_animated"];
/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end
// Create chart instance
let chart = am4core.create("sankeybar", am4charts.XYChart);
// Add data
chart.data = [{
        "year": "",
        "bef": 2.5,
        "sel": 2.5,
        "aft": 2.5
    }];
chart.legend = new am4charts.Legend();
chart.legend.position = "right";
// Create axes
let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
categoryAxis.dataFields.category = "year";
categoryAxis.renderer.grid.template.opacity = 0;
let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
valueAxis.min = 0;
valueAxis.renderer.grid.template.opacity = 0;
valueAxis.renderer.ticks.template.strokeOpacity = 0.5;
valueAxis.renderer.ticks.template.stroke = am4core.color("#495C43");
valueAxis.renderer.ticks.template.length = 10;
valueAxis.renderer.line.strokeOpacity = 0.5;
valueAxis.renderer.baseGrid.disabled = true;
valueAxis.renderer.minGridDistance = 40;
// Create series
function createSeries(field, name) {
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueX = field;
    series.dataFields.categoryY = "year";
    series.stacked = true;
    series.name = name;
    let labelBullet = series.bullets.push(new am4charts.LabelBullet());
    labelBullet.locationX = 0.5;
    labelBullet.label.text = "";
    labelBullet.label.fill = am4core.color("#fff");
}
createSeries("bef", "Before");
createSeries("sel", "Selected");
createSeries("aft", "After");
