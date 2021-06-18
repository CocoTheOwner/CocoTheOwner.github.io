define(["require", "exports", "./csvParser", "./visualisationController", "./sankeyBar"], function (require, exports, csvParser_1, visualisationController_1, sankeyBar_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let input1 = document.getElementById("f_input_popup"); //get file input for popup
    let input2 = document.getElementById("f_input"); //get file input button
    let checkbox = document.getElementById("checkbox");
    let checkbox_alluvial = document.getElementById("checkbox-alluvial");
    let resetDates = document.getElementById("date_reset");
    let calendar = document.getElementById("calendar");
    let reader;
    let close = document.getElementsByClassName("close")[0];
    var modal = document.getElementById("myModal");
    function analyseCSVData() {
        let emails = [];
        let lookup = [];
        let datestrings = [];
        let fractions = [];
        csvParser_1.readCsv(reader.result, emails, lookup, datestrings);
        calendar.value = window['dataStartDate'] + " - " + window['dataEndDate'];
        console.log("File uploaded successfully");
        modal.style.display = "none";
        window["emails"] = emails;
        window["lookup"] = lookup;
        window["selectedJob"] = "Unknown";
        visualisationController_1.updateCharts(8, fractions);
        sankeyBar_1.default(fractions, datestrings);
    }
    //when input changes, update file
    input1.addEventListener('change', function (e) {
        reader = new FileReader();
        reader.onload = analyseCSVData;
        reader.readAsText(input1.files[0]);
    });
    // When the user clicks on <span> (x), close the modal
    close.onclick = function () {
        modal.style.display = "none";
    };
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
    //when input changes, update file
    input2.addEventListener('change', function (e) {
        reader = new FileReader();
        reader.onload = analyseCSVData;
        reader.readAsText(input2.files[0]);
    });
    checkbox.addEventListener('change', function (e) {
        window['self-edge'] = !window['self-edge'];
        visualisationController_1.updateJobChord();
    });
    checkbox_alluvial.addEventListener('change', function (e) {
        window['full-alluvial'] = !window['full-alluvial'];
        //updateSankey();
    });
    calendar.onchange = function (e) {
        if (window['reset']) {
            window['reset'] = false;
            window["startDate"] = new Date(window['dataStartDate']);
            window["endDate"] = new Date(window['dataEndDate']);
            let fractions = [];
            visualisationController_1.updateMainChord(window["emails"], window["lookup"], fractions);
            sankeyBar_1.default(fractions);
        }
    };
    resetDates.onclick = function (e) {
        window['reset'] = true;
        calendar.value = window['dataStartDate'] + " - " + window['dataEndDate'];
        calendar.onchange(e);
        visualisationController_1.updateCharts(8, []);
    };
});
