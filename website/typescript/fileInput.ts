import {Employee, readCsv} from "./csvParser"
import {emails} from "./csvData"

const lookup: { [id: number]: Employee } = {};
const input = document.querySelector('input[type="file"]');

input.addEventListener('change', function (e) {
    const reader = new FileReader();
    reader.onload = function () {
        readCsv(reader.result as string, emails, lookup);
    };
    reader.readAsText((input as HTMLInputElement).files[0]);
    (document.getElementById("f_input") as HTMLInputElement).value = null;
    console.log(emails.length);
});
