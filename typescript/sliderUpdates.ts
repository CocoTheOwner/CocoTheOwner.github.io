import { updateSankey } from "./visualisationController"
import {drawSankeyLabels} from "./sankeyBar";
window["sClusters"] = 8
var slider = <HTMLInputElement> document.getElementById("alluvial-slider");
var output = document.getElementById("alluvial-text");

// Update the current slider value (each time you drag the slider handle)
slider.onchange = function() {
    window["sClusters"] = slider.value
    updateSankey();
    drawSankeyLabels()
}
slider.oninput = function() {
    output.innerHTML = "Number of clusters in Alluvial: " + slider.value.toString(); // Display the default slider value
}