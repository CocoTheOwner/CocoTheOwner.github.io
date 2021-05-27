import {readCsv} from "./csvParser"
import {emails as e, lookup as l} from "./csvData"
import {chart} from "./amChartSankey"

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
    console.log("File uploaded successfully")
    chart.data = [
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
    chart.validateData();
});
