define(["require", "exports", "./visualisationController"], function (require, exports, visualisationController_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    window["sClusters"] = 8;
    var slider = document.getElementById("alluvial-slider");
    var output = document.getElementById("alluvial-text");
    // Update the current slider value (each time you drag the slider handle)
    slider.oninput = function () {
        output.innerHTML = "Number of clusters in Alluvial: " + slider.value.toString(); // Display the default slider value
        window["sClusters"] = slider.value;
        console.log("Updating sankey");
        visualisationController_1.updateCharts();
    };
});
