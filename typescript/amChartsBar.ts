var am4core = window["am4core"]
var am4charts = window["am4charts"]
var am4themes_animated = window["am4themes_animated"]

/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance
let chart = am4core.create("sankeybar", am4charts.XYChart);

// Add data
chart.data = [{
  "year": "2016",
  "europe": 2.5,
  "namerica": 2.5,
  "asia": 2.1,
  "lamerica": 0.3,
  "meast": 0.2,
  "africa": 0.1
}, {
  "year": "2017",
  "europe": 2.6,
  "namerica": 2.7,
  "asia": 2.2,
  "lamerica": 0.3,
  "meast": 0.3,
  "africa": 0.1
}, {
  "year": "2018",
  "europe": 2.8,
  "namerica": 2.9,
  "asia": 2.4,
  "lamerica": 0.3,
  "meast": 0.3,
  "africa": 0.1
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
  labelBullet.label.text = "{valueX}";
  labelBullet.label.fill = am4core.color("#fff");
}

createSeries("europe", "Europe");
createSeries("namerica", "North America");
createSeries("asia", "Asia");
createSeries("lamerica", "Latin America");
createSeries("meast", "Middle East");
createSeries("africa", "Africa");