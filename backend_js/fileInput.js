define(["require", "exports", "./csvParser", "./visualisationController"], function (require, exports, csvParser_1, visualisationController_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let input1 = document.getElementById("f_input_popup"); //get file input for popup
    let input2 = document.getElementById("f_input"); //get file input button
    //when input changes, update file
    input1.addEventListener('change', function (e) {
        const reader = new FileReader();
        reader.onload = function () {
            let emails = [];
            let lookup = [];
            csvParser_1.readCsv(reader.result, emails, lookup);
            console.log("File uploaded successfully");
            var modal = document.getElementById("myModal");
            modal.style.display = "none";
            window["emails"] = emails;
            window["lookup"] = lookup;
            visualisationController_1.updateCharts(8);
        };
        reader.readAsText(input1.files[0]);
    });
    //when input changes, update file
    input2.addEventListener('change', function (e) {
        const reader = new FileReader();
        reader.onload = function () {
            let emails = [];
            let lookup = [];
            csvParser_1.readCsv(reader.result, emails, lookup);
            console.log("File uploaded successfully");
            window["emails"] = emails;
            window["lookup"] = lookup;
            visualisationController_1.updateCharts(8);
        };
        reader.readAsText(input2.files[0]);
    });
});
