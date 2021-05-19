import {Employee, readCsv} from "./csvParser"
import {emails} from "./csvData"

const lookup: { [id: number]: Employee } = {};  // create lookuptable
const input = document.querySelector('input[type="file"]'); //get file input

//when input changes, update file
input.addEventListener('change', function (e) {
    const reader = new FileReader();
    reader.onload = function () {
        readCsv(reader.result as string, emails, lookup);
    };
    reader.readAsText((input as HTMLInputElement).files[0]);
    (document.getElementById("f_input") as HTMLInputElement).value = null; //reset input
    console.log(emails.length);
});
