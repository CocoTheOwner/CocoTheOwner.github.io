define(["require", "exports", "./csvParser", "./csvData"], function (require, exports, csvParser_1, csvData_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const lookup = {}; // create lookuptable
    const input = document.querySelector('input[type="file"]'); //get file input
    //when input changes, update file
    input.addEventListener('change', function (e) {
        const reader = new FileReader();
        reader.onload = function () {
            csvParser_1.readCsv(reader.result, csvData_1.emails, lookup);
        };
        reader.readAsText(input.files[0]);
        document.getElementById("f_input").value = null; //reset input
        console.log(csvData_1.emails.length);
    });
});
