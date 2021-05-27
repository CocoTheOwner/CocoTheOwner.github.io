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
        "showWeekNumbers": true
    }, function (start, end) {
        export let startDate, endDate;
        
        startDate = new Date(start.format('YYYY-MM-DD'));
        endDate = new Date(end.format('YYYY-MM-DD'));
        alert('Hello');
        // export {start, end};
        console.log('New date range selected: from ' + startDate + ' to ' + endDate);
    });
});
