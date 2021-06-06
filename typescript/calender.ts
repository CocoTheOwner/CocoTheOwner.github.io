import {updateChord} from "./visualisationController";
import makeSankeyBar from "./sankeyBar";

let jq = window["$"]

jq(function () {
    jq('input[name="daterange"]').daterangepicker({
        "locale": {
            "format": "YYYY/MM/DD",
            "separator": " - ",
            "applyLabel": "Apply",
            "cancelLabel": "Cancel",
            "fromLabel": "From",
            "toLabel": "To",
            "customRangeLabel": "Custom",
            "weekLabel": "W",
            "daysOfWeek": [
                "Su",
                "Mo",
                "Tu",
                "We",
                "Th",
                "Fr",
                "Sa"
            ],
            "monthNames": [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"
            ],
            "firstDay": 1
        },

        // start and end date of the selection
        "startDate": "2000/03/01",
        "endDate": "2001/03/01",

        "showDropdowns": true,
        "showWeekNumbers": true
    }, async function (start, end) {
        await new Promise( resolve => setTimeout(resolve, 500) );
        console.log(start.format('YYYY-MM-DD'));
        console.log(end.format('YYYY-MM-DD'));

        let fractions: number[] = [];
        updateChord(window["emails"], window["lookup"], fractions);
        makeSankeyBar(fractions);
    });
});

// alert user to change to a biger screen
if (jq(window).width() < 960) {
    alert('Your device\'s screen might be to small to view this project at its best performance. Please switch to a larger screen and continue.');
}