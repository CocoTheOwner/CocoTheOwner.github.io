define(["require", "exports", "./csvParser", "./csvData", "./amChartSankey"], function (require, exports, csvParser_1, csvData_1, amChartSankey_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var emails = Object.assign([], csvData_1.emails);
    var lookup = Object.assign([], csvData_1.lookup);
    const input = document.querySelector('input[type="file"]'); //get file input
    //when input changes, update file
    input.addEventListener('change', function (e) {
        const reader = new FileReader();
        reader.onload = function () {
            csvParser_1.readCsv(reader.result, emails, lookup);
        };
        reader.readAsText(input.files[0]);
        document.getElementById("f_input").value = null; //reset input
        console.log("File uploaded successfully");
        amChartSankey_1.chart.data = [
            { from: "A", to: "D", value: 20 },
            { from: "B", to: "D", value: 20 },
            { from: "B", to: "E", value: 20 },
            { from: "C", to: "E", value: 20 },
            { from: "D", to: "G", value: 20 },
            { from: "D", to: "I", value: 20 },
            { from: "D", to: "H", value: 20 },
            { from: "E", to: "H", value: 20 },
            { from: "G", to: "J", value: 20 },
            { from: "I", to: "J", value: 20 }
        ];
        amChartSankey_1.chart.validateData();
    });
});
