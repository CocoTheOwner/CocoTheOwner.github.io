define(["require", "exports", "./csvParser", "./csvData", "./visualisationController"], function (require, exports, csvParser_1, csvData_1, visualisationController_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var emails = Object.assign([], csvData_1.emails);
    var lookup = Object.assign([], csvData_1.lookup);
    const input = document.querySelector('input[type="file"]'); //get file input
    //when input changes, update file
    input.addEventListener('change', function (e) {
        const reader = new FileReader();
        reader.onload = function () {
            csvParser_1.readCsv(reader.result, emails, lookup);
        };
        reader.readAsText(input.files[0]);
        document.getElementById("f_input").value = null; //reset input
        console.log("File uploaded successfully");

        // after the file was uploaded, close the pop-up
        modal.style.display = "none";
        
        visualisationController_1.updateCharts(emails, lookup, 8);
    });
});

/**
 * Pop-up window for upload button 
 */

var modal = document.getElementById("myModal");
// when the visualize page is ran, ask the user to upload the data set
window.onload = function() {
  modal.style.display = "block";
}
