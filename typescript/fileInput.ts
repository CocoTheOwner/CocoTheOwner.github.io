import {readCsv} from "./csvParser"
import {emails as e, lookup as l} from "./csvData"
import {updateCharts} from "./visualisationController"

var emails = Object.assign([], e);
var lookup = Object.assign([], l);
var input1 = (document.getElementById("f_input_popup") as HTMLInputElement); //get file input for popup
var input2 = (document.getElementById("f_input") as HTMLInputElement); //get file input button

//when input changes, update file
input1.addEventListener('change', function (e) {
    const reader = new FileReader();
    reader.onload = function () {
        readCsv(reader.result as string, emails, lookup);
    };
    reader.readAsText(input1.files[0]);
    console.log("File uploaded successfully");
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
    updateCharts(emails, lookup, 8);
});


//when input changes, update file
input2.addEventListener('change', function (e) {
    const reader = new FileReader();
    reader.onload = function () {
        readCsv(reader.result as string, emails, lookup);
    };
    reader.readAsText(input2.files[0]);
    console.log("File uploaded successfully");
    updateCharts(emails, lookup, 8);
});
