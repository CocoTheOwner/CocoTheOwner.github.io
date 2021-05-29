define(["require", "exports", "./amChartSankey"], function (require, exports, amChartSankey_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.updateCharts = void 0;
    // import {MailGraph, findTimeIndex} from "./MailGraph"
    function updateCharts(emails, lookup) {
        // Mailcap
        const mailCap = emails.length;
        emails.sort(function (e1, e2) { return e1.date.getTime() - e2.date.getTime(); });
        console.log(emails);
        // List job titles
        const jobtitles = ["Unknown", "Employee", "CEO", "Director", "Trader", "President", "Vice President", "Manager", "Managing Director", "In House Lawyer"];
        // Retrieve the first and last date in the sorted mails array
        const firstdate = emails[0].date;
        const lastdate = emails[mailCap - 1].date;
        // Set a default number for the amount of clusters
        var clusters = 8;
        // Calculate the time between the first and last mail
        const timeframe = lastdate.getTime() - firstdate.getTime();
        // Calculate the dates between which the clusters exist.
        const dates = [];
        for (let i = 0; i <= clusters; i++) {
            dates[i] = firstdate.getTime() + timeframe / clusters * i;
        }
        // Loop over all mails and add them to their respective clusters
        var currentCluster = 0;
        var mailnum = 0;
        const splitMails = {};
        var clusterMail = [];
        for (let i = 0; i < mailCap; i++) {
            let mail = emails[i];
            let date = mail.date;
            while (date.getTime() >= dates[currentCluster]) {
                currentCluster += 1;
                console.log("Cluster " + currentCluster + " being filled.");
                splitMails[currentCluster] = clusterMail;
                clusterMail = [];
                mailnum = 0;
            }
            clusterMail[clusterMail.length] = mail;
        }
        splitMails[currentCluster] = clusterMail;
        // Create a dictionary with the jobtitles stacked twice
        const jobsFromTo = [];
        for (let i = 0; i < clusters; i++) {
            jobsFromTo[i] = {};
            for (let job in jobtitles) {
                jobsFromTo[i][jobtitles[job]] = {};
                for (let _job in jobtitles) {
                    jobsFromTo[i][jobtitles[job]][jobtitles[_job]] = [];
                }
            }
        }
        // For each of the clusters
        for (let cluster = 0; cluster < clusters; cluster++) {
            // For each of the mails
            for (let mail in splitMails[cluster]) {
                // Get from and to jobtitle
                var fromjob = lookup[splitMails[cluster][mail].fromId].jobTitle;
                var tojob = lookup[splitMails[cluster][mail].toId].jobTitle;
                // Store using the from and to job the mail counter
                jobsFromTo[cluster][fromjob][tojob].push(splitMails[cluster][mail]);
            }
        }
        // Clear data
        amChartSankey_1.default.data = [];
        // Colors
        const colors = {};
        // Assign colors to the jobtitles (so each title has the same color)
        for (let fjob in jobtitles) {
            let col = amChartSankey_1.default.colors.next();
            for (let i = 0; i <= clusters; i++) {
                if (i === 0) {
                    amChartSankey_1.default.data.push({ from: jobtitles[fjob], color: col });
                    continue;
                }
                amChartSankey_1.default.data.push({ from: jobtitles[fjob] + " (" + i + ")", color: col });
            }
        }
        // Set the data from the job clusters in the chart
        for (let i in jobsFromTo) {
            for (let fjob in jobsFromTo[i]) {
                for (let tjob in jobsFromTo[i][fjob]) {
                    if (i === "0") {
                        amChartSankey_1.default.data.push({ from: fjob, to: tjob + " (" + String(Number(i) + 1) + ")", value: jobsFromTo[i][fjob][tjob].length });
                        continue;
                    }
                    amChartSankey_1.default.data.push({ from: fjob + " (" + i + ")", to: tjob + " (" + String(Number(i) + 1) + ")", value: jobsFromTo[i][fjob][tjob].length });
                }
            }
        }
        amChartSankey_1.default.validateData(); // Updates the sankeyChart
        // chordChart.validateData(); // Updates the chord diagram
    }
    exports.updateCharts = updateCharts;
});
