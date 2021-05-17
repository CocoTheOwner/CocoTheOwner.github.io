import {Employee, readCsv} from "./csvParser"
import {emails} from "./csvData"

const lookup = {};
const input = document.querySelector('input[type="file"]');

input.addEventListener('change', function (e) {
    const reader = new FileReader();
    reader.onload = function () {
        readCsv(reader.result, emails, lookup);
    };
    reader.readAsText((input).files[0]);
    (document.getElementById("f_input")).value = null;
    console.log(emails.length);
});
