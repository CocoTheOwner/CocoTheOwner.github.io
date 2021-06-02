import {readCsv} from "./csvParser"
import {emails as e, lookup as l} from "./csvData"
import {updateCharts} from "./visualisationController"

var emails = Object.assign([], e);
var lookup = Object.assign([], l);
const input1 = document.getElementById("f_input_popup"); //get file input

//when input changes, update file
input1.addEventListener('change', function (e) {
    const reader = new FileReader();
    reader.onload = function () {
        readCsv(reader.result as string, emails, lookup);
    };
    reader.readAsText((input1 as HTMLInputElement).files[0]);
    console.log("File uploaded successfully");
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
    updateCharts(emails, lookup, 8);
});

const input2 = document.getElementById("f_input"); //get file input

//when input changes, update file
input2.addEventListener('change', function (e) {
    const reader = new FileReader();
    reader.onload = function () {
        readCsv(reader.result as string, emails, lookup);
    };
    reader.readAsText((input2 as HTMLInputElement).files[0]);
    console.log("File uploaded successfully");
    updateCharts(emails, lookup, 8);
});
