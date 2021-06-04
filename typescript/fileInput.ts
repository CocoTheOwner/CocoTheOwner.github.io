import {readCsv} from "./csvParser"
import {updateCharts} from "./visualisationController"

let input1 = (document.getElementById("f_input_popup") as HTMLInputElement); //get file input for popup
let input2 = (document.getElementById("f_input") as HTMLInputElement); //get file input button

//when input changes, update file
input1.addEventListener('change', function (e) {
    const reader = new FileReader();
    reader.onload = function () {
        let emails = []
        let lookup = []
        readCsv(reader.result as string, emails, lookup);
        console.log("File uploaded successfully");
        var modal = document.getElementById("myModal");
        modal.style.display = "none";
        window["emails"] = emails
        window["lookup"] = lookup
        updateCharts(8);
    };
    reader.readAsText(input1.files[0]);
});


//when input changes, update file
input2.addEventListener('change', function (e) {
    const reader = new FileReader();
    reader.onload = function () {
        let emails = []
        let lookup = []
        readCsv(reader.result as string, emails, lookup);
        console.log("File uploaded successfully");
        window["emails"] = emails
        window["lookup"] = lookup
        updateCharts(8);
    };
    reader.readAsText(input2.files[0]);
});
