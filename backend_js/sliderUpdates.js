define(["require", "exports", "./visualisationController", "./sankeyBar"], function (require, exports, visualisationController_1, sankeyBar_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    window["sClusters"] = 8;
    var slider = document.getElementById("alluvial-slider");
    var output = document.getElementById("alluvial-text");
    // Update the current slider value (each time you drag the slider handle)
    slider.onchange = function () {
        window["sClusters"] = slider.value;
        visualisationController_1.updateSankey();
        sankeyBar_1.drawSankeyLabels();
    };
    slider.oninput = function () {
        output.innerHTML = "Number of clusters in Alluvial: " + slider.value.toString(); // Display the default slider value
    };
});
