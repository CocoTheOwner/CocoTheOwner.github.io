// Definitely not html ok

import {Email, Employee, readCsv} from "./csvParser.js";
import {emails} from "./csvData.js";
console.log("yeet");
var lookup = {};
var input = document.querySelector('input[type="file"]');
input.addEventListener('change', function (e) {
    var reader = new FileReader();
    reader.onload = function () {
        readCsv(reader.result, emails, lookup);
    };
    reader.readAsText(input.files[0]);
    document.getElementById("f_input").value = null;
    console.log(emails.length);
});
