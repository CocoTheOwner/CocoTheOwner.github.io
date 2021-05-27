define(["require", "exports", "./amChartChord", "./amChartSankey"], function (require, exports, amChartChord_1, amChartSankey_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.updateCharts = void 0;
    function updateCharts(emails, lookup) {
        emails.sort(function (e1, e2) { return e1.date.getTime() - e2.date.getTime(); });
        // List job titles
        const jobtitles = ["Unknown", "Employee", "CEO", "Director", "Trader", "President", "Vice President", "Manager", "Managing Director", "In House Lawyer"];
        // Retrieve the first and last date in the sorted mails array
        const firstdate = emails[0].date;
        const lastdate = emails[emails.length - 1].date;
        // Set a default number for the amount of clusters
        var clusters = 4;
        // Calculate the time between the first and last mail
        const timeframe = lastdate.getTime() - firstdate.getTime();
        // Calculate the dates between which the clusters exist.
        const dates = [];
        for (let i = 0; i <= clusters; i++) {
            dates[i] = firstdate.getTime() + timeframe / clusters * i;
        }
        for (let date in dates) {
            console.log(dates[date]);
            console.log(new Date(dates[date]).toDateString());
        }
        // Loop over all mails and add them to their respective clusters
        var currentCluster = 0;
        var mailnum = 0;
        const splitMails = {};
        var clusterMail = [];
        for (let i = 0; i < 20; i++) {
            let mail = emails[i];
            let date = mail.date;
            while (date.getTime() >= dates[currentCluster]) {
                console.log("Empty");
                currentCluster += 1;
                splitMails[currentCluster] = clusterMail;
                clusterMail = [];
                mailnum = 0;
            }
            console.log("Mail of " + mail.date.toDateString() + " may be before: " + new Date(dates[currentCluster]).toDateString() + " goes into cluster " + currentCluster);
            clusterMail[clusterMail.length] = mail;
            console.log(clusterMail.length);
        }
        splitMails[currentCluster] = clusterMail;
        console.log(splitMails);
        console.log(Object.keys(splitMails).length);
        for (let cluster in splitMails) {
            console.log(splitMails[cluster].length);
        }
        var x = emails[0].appreciation;
        amChartSankey_1.chart.data = [
            { from: "A", to: "D", value: 1 },
            { from: "B", to: "D", value: x },
            { from: "B", to: "E", value: x },
            { from: "C", to: "E", value: x },
            { from: "D", to: "G", value: x },
            { from: "D", to: "I", value: x },
            { from: "D", to: "H", value: x },
            { from: "E", to: "H", value: x },
            { from: "G", to: "J", value: x },
            { from: "I", to: "J", value: x }
        ];
        amChartSankey_1.chart.validateData();
        amChartChord_1.chart.validateData();
    }
    exports.updateCharts = updateCharts;
});
