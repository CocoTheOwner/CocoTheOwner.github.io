define(["require", "exports", "./csvParser", "./csvData", "./visualisationController"], function (require, exports, csvParser_1, csvData_1, visualisationController_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var emails = Object.assign([], csvData_1.emails);
    var lookup = Object.assign([], csvData_1.lookup);
    var input1 = document.getElementById("f_input_popup"); //get file input for popup
    var input2 = document.getElementById("f_input"); //get file input button
    //when input changes, update file
    input1.addEventListener('change', function (e) {
        const reader = new FileReader();
        reader.onload = function () {
            csvParser_1.readCsv(reader.result, emails, lookup);
        };
        reader.readAsText(input1.files[0]);
        console.log("File uploaded successfully");
        var modal = document.getElementById("myModal");
        modal.style.display = "none";
        window["emails"] = emails;
        window["lookup"] = lookup;
        visualisationController_1.updateCharts(8);
    });
    //when input changes, update file
    input2.addEventListener('change', function (e) {
        const reader = new FileReader();
        reader.onload = function () {
            csvParser_1.readCsv(reader.result, emails, lookup);
        };
        reader.readAsText(input2.files[0]);
        console.log("File uploaded successfully");
        window["emails"] = emails;
        window["lookup"] = lookup;
        visualisationController_1.updateCharts(8);
    });
});
