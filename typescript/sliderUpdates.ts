import { updateCharts } from "./visualisationController"
window["sClusters"] = 8
var slider = <HTMLInputElement> document.getElementById("alluvial-slider");
var output = document.getElementById("alluvial-text");

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    output.innerHTML = "Number of clusters in Alluvial: " + slider.value.toString(); // Display the default slider value
    window["sClusters"] = slider.value
    console.log("Updating sankey")
    updateCharts()
}