// import {Email} from "./csvParser"
// import { MailGraph } from "./mailGraph";
// // let min_date = Email[0].date
// // let max_date = Email[Email.length].date
// // console.log(min_date)
// function date(){
// let startDate, endDate;
$(function () {
    $('input[name="daterange"]').daterangepicker({
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
        // start and end date of the sleection
        "startDate": "2021/05/19",
        "endDate": "2021/05/25",
        "showDropdowns": true,
        "showWeekNumbers": true,
        // button theme - doesn't work for some reason...
        // "applyButtonClasses": "btn-outline-primary btn-sm"
        // function which is executed once the selection takes place
        // input: start date, end date
        // output: should output the filtered visualizations
    }, function (start, end) {
        let startDate = start.format('YYYY-MM-DD');
        let endDate = end.format('YYYY-MM-DD');
        console.log('New date range selected: from ' + startDate + ' to ' + endDate);
    });
});
