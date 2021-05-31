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
        visualisationController_1.updateCharts(emails, lookup, 8);
    });
});


// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}