
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
    }, function (start, end) {
        console.log(start.format('YYYY-MM-DD'));
        console.log(end.format('YYYY-MM-DD'));
    });
});