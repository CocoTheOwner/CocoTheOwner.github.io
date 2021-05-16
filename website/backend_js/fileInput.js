"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var csvParser_1 = require("./csvParser");
var csvData_1 = require("./csvData");
var lookup = {};
var input = document.querySelector('input[type="file"]');
input.addEventListener('change', function (e) {
    var reader = new FileReader();
    reader.onload = function () {
        csvParser_1.readCsv(reader.result, csvData_1.emails, lookup);
    };
    reader.readAsText(input.files[0]);
    document.getElementById("f_input").value = null;
    console.log(csvData_1.emails.length);
});
