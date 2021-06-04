import {readCsv} from "./csvParser"
import {updateCharts} from "./visualisationController"
import makeSankeyBar from "./sankeyBar"

let input1 = (document.getElementById("f_input_popup") as HTMLInputElement); //get file input for popup
let input2 = (document.getElementById("f_input") as HTMLInputElement); //get file input button
let reader;

function analyseCSVData() {
    let emails = []
    let lookup = []
    let datestrings = []
    let fractions = [];
    readCsv(reader.result as string, emails, lookup, datestrings);
    console.log("File uploaded successfully");
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
    window["emails"] = emails
    window["lookup"] = lookup
    updateCharts(8, fractions);
    makeSankeyBar(fractions, datestrings);
}

//when input changes, update file
input1.addEventListener('change', function (e) {
    reader = new FileReader();
    reader.onload = analyseCSVData;
    reader.readAsText(input1.files[0]);
});


//when input changes, update file
input2.addEventListener('change', function (e) {
    reader = new FileReader();
    reader.onload = analyseCSVData;
    reader.readAsText(input2.files[0]);
});
