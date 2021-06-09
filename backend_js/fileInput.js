define(["require", "exports", "./csvParser", "./visualisationController", "./sankeyBar"], function (require, exports, csvParser_1, visualisationController_1, sankeyBar_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let input1 = document.getElementById("f_input_popup"); //get file input for popup
    let input2 = document.getElementById("f_input"); //get file input button
    let reader;
    function analyseCSVData() {
        let emails = [];
        let lookup = [];
        let datestrings = [];
        let fractions = [];
        csvParser_1.readCsv(reader.result, emails, lookup, datestrings);
        console.log("File uploaded successfully");
        var modal = document.getElementById("myModal");
        modal.style.display = "none";
        window["emails"] = emails;
        window["lookup"] = lookup;
        window["selectedJob"] = "Unknown";
        visualisationController_1.updateCharts(8, fractions);
        sankeyBar_1.default(fractions, datestrings);
    }
    //when input changes, update file
    input1.addEventListener('change', function (e) {
        reader = new FileReader();
        reader.onload = analyseCSVData;
        reader.readAsText(input1.files[0]);
    });
    //when input changes, update file
    input2.addEventListener('change', function (e) {
        reader = new FileReader();
        reader.onload = analyseCSVData;
        reader.readAsText(input2.files[0]);
    });
});
