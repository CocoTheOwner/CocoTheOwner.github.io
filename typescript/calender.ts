import {updateMainChord} from "./visualisationController";
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
        window["startDate"] = start._d
        window["endDate"] = end._d

        let fractions: number[] = [];
        updateMainChord(window["emails"], window["lookup"], fractions);
        makeSankeyBar(fractions);
    });
});

// alert user to change to a bigger screen
if (/Mobi|Android/i.test(navigator.userAgent) || /Mobi/.test(navigator.userAgent)) {
    alert('Your device\'s screen might be to small to view this project at its best performance. Please switch to a larger screen and continue.');
}