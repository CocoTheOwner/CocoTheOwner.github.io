import {readCsv} from "./csvParser"
import {emails as e, lookup as l} from "./csvData"
import {updateCharts} from "./visualisationController"

var emails = Object.assign([], e);
var lookup = Object.assign([], l);
const input = document.querySelector('input[type="file"]'); //get file input

//when input changes, update file
input.addEventListener('change', function (e) {
    const reader = new FileReader();
    reader.onload = function () {
        readCsv(reader.result as string, emails, lookup);
    };
    reader.readAsText((input as HTMLInputElement).files[0]);
    (document.getElementById("f_input") as HTMLInputElement).value = null; //reset input
    console.log("File uploaded successfully");
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
    console.log(modal)
    updateCharts(emails, lookup, 8);
});
