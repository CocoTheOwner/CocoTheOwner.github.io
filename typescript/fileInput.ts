import {readCsv} from "./csvParser"
import {updateCharts, updateJobChord, updateMainChord, updateSankey} from "./visualisationController"
import makeSankeyBar from "./sankeyBar"

let input1 = (document.getElementById("f_input_popup") as HTMLInputElement); //get file input for popup
let input2 = (document.getElementById("f_input") as HTMLInputElement); //get file input button
let checkbox = (document.getElementById("checkbox") as HTMLInputElement);
let checkbox_alluvial = (document.getElementById("checkbox-alluvial") as HTMLInputElement);
let resetDates = (document.getElementById("date_reset") as HTMLButtonElement);
let calendar = (document.getElementById("calendar") as HTMLInputElement);
let reader;
let close = document.getElementsByClassName("close")[0] as HTMLElement;
var modal = document.getElementById("myModal");

function analyseCSVData() {
    let emails = []
    let lookup = []
    let datestrings = []
    let fractions = [];
    readCsv(reader.result as string, emails, lookup, datestrings);
    calendar.value = window['dataStartDate'] + " - " + window['dataEndDate'];
    console.log("File uploaded successfully");
    modal.style.display = "none";
    window["emails"] = emails
    window["lookup"] = lookup
    window["selectedJob"] = "Unknown"
    updateCharts(8, fractions);
    makeSankeyBar(fractions, datestrings);
}

//when input changes, update file
input1.addEventListener('change', function (e) {
    reader = new FileReader();
    reader.onload = analyseCSVData;
    reader.readAsText(input1.files[0]);
});



// When the user clicks on <span> (x), close the modal
close.onclick = function() {
    modal.style.display = "none";
  }
  
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
}


//when input changes, update file
input2.addEventListener('change', function (e) {
    reader = new FileReader();
    reader.onload = analyseCSVData;
    reader.readAsText(input2.files[0]);
});

checkbox.addEventListener('change', function (e) {
    window['self-edge'] = !window['self-edge'];
    updateJobChord();
});

checkbox_alluvial.addEventListener('change', function (e) {
    window['full-alluvial'] = !window['full-alluvial']
    //updateSankey();
});

calendar.onchange = function (e) {
    if (window['reset']) {
        window['reset'] = false;

        window["startDate"] = new Date(window['dataStartDate'])
        window["endDate"] = new Date(window['dataEndDate'])
    
        let fractions: number[] = [];
        updateMainChord(window["emails"], window["lookup"], fractions);
        makeSankeyBar(fractions);
    }
};

resetDates.onclick = function (e) {
    window['reset'] = true;
    calendar.value = window['dataStartDate'] + " - " + window['dataEndDate'];
    calendar.onchange(e);
    updateCharts(8, []);
}