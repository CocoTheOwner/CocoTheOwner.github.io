define(["require", "exports", "./amChartChord", "./amChartSankey", "./mailGraph"], function (require, exports, amChartChord_1, amChartSankey_1, mailGraph_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.updateCharts = void 0;
    // import {MailGraph, findTimeIndex} from "./MailGraph"
    function updateCharts(emails, lookup, sankeyClusters = 8) {
        updateSankey(emails, lookup, sankeyClusters);
        updateChord(emails, lookup);
        amChartSankey_1.default.validateData(); // Updates the sankeyChart
        amChartChord_1.default.validateData(); // Updates the chord diagram 
    }
    exports.updateCharts = updateCharts;
    function updateSankey(emails, lookup, clusters = 8) {
        // Sort emails by date
        emails.sort(function (e1, e2) { return e1.date.getTime() - e2.date.getTime(); });
        // Calculate the time between the first and last mail
        const timeframe = emails[emails.length - 1].date.getTime() - emails[0].date.getTime();
        // Calculate the dates between which the clusters exist.
        const dates = []; // Will contain as first element the first date and as the last, the last.
        for (let i = 0; i <= clusters; i++) {
            dates[i] = emails[0].date.getTime() + timeframe / clusters * i;
        }
        // Loop over all mails and set counters, totals and colors
        let jobInfo = {};
        let mailCounters = {};
        let timeslot = 1;
        for (let mailNum in emails) {
            // Get the mail
            let mail = emails[mailNum];
            // Get the job titles
            let fjob = lookup[mail.fromId].jobTitle;
            let tjob = lookup[mail.toId].jobTitle;
            // Check if the f/tjobs are in the jobID list, and add them if not
            if (jobInfo[fjob] === undefined) {
                jobInfo[fjob] = {
                    id: Object.keys(jobInfo).length,
                    color: amChartSankey_1.default.colors.next(),
                    name: fjob
                };
            }
            if (jobInfo[tjob] === undefined) {
                jobInfo[tjob] = {
                    id: Object.keys(jobInfo).length,
                    color: amChartSankey_1.default.colors.next(),
                    name: tjob
                };
            }
            // Get the date (as a numeric value)
            let date = mail.date.getTime();
            // Check if we are in the next timeslot
            if (date > dates[timeslot])
                timeslot += 1;
            // Make sure there is a section for the timeslot and the fromJob
            if (mailCounters[timeslot] === undefined)
                mailCounters[timeslot] = {};
            if (mailCounters[timeslot][fjob] === undefined)
                mailCounters[timeslot][fjob] = {};
            // Add one to the counter of the current timeslot
            if (mailCounters[timeslot]["total"] === undefined)
                mailCounters[timeslot]["total"] = 1;
            else
                mailCounters[timeslot]["total"] += 1;
            // Add one to the counter of the current fromJob->toJob
            if (mailCounters[timeslot][fjob][tjob] === undefined)
                mailCounters[timeslot][fjob][tjob] = 1;
            else
                mailCounters[timeslot][fjob][tjob] += 1;
        }
        // Calculate fractions per job for the timeslot it is in
        for (let timeslot in mailCounters) {
            // Get total for timeslot
            let timeslotTotal = mailCounters[timeslot]["total"];
            // Loop over all jobs and get their total (in the timeslot) and calculate&save fraction
            for (let j in jobInfo) {
                // Skip undefined
                if (jobInfo[j] === undefined)
                    continue;
                let fjob = jobInfo[j].name;
                // Make sure the dict exists
                if (mailCounters[timeslot][fjob] === undefined)
                    mailCounters[timeslot][fjob] = {};
                // Loop over the to jobs
                for (let k in jobInfo) {
                    // Skip undefined
                    if (jobInfo[k] === undefined)
                        continue;
                    let tjob = jobInfo[k].name;
                    // Make sure the dict exists
                    if (mailCounters[timeslot][fjob][tjob] === undefined) {
                        mailCounters[timeslot][fjob][tjob] = 0;
                        continue;
                    }
                    // Retrieve the job total (this is from fjob and to tjob)
                    let jobTotal = mailCounters[timeslot][fjob][tjob];
                    // Calculate the fraction for the timeslot
                    let fraction = jobTotal / timeslotTotal * 100;
                    // Store the fraction instead of the counter (overwritten)
                    mailCounters[timeslot][fjob][tjob] = fraction;
                }
            }
        }
        // Reset sankey data
        amChartSankey_1.default.data = [];
        for (let i in mailCounters) {
            // Turn the timeslot string into a number, and count from 0
            let timeslot = Number(i) - 1;
            // Loop over the from jobs
            for (let j in jobInfo) {
                let fjob = jobInfo[j];
                // Loop over the to jobs
                for (let k in jobInfo) {
                    let tjob = jobInfo[k];
                    // Get the fraction value for this datapoint
                    let value = 0;
                    try {
                        value = mailCounters[String(timeslot + 1)][fjob.name][tjob.name];
                    }
                    catch (_a) {
                        console.log(fjob + " / " + tjob + " " + timeslot);
                        continue;
                    }
                    // Add a datapoint to the chart
                    amChartSankey_1.default.data.push(addSankeyConnection(fjob.name, tjob.name, timeslot, value, jobInfo));
                }
                // If there are no connections, the color is not set. Hence this line.
                amChartSankey_1.default.data.push(addSankeyColor(fjob.name, timeslot, jobInfo));
            }
        }
    }
    function addSankeyColor(fjob, timeslot, jobInfo) {
        // Make the "from" string, which is either, (CEO as example):
        // 0 CEO (0)     -> First entry
        // 0 (X)         -> Xth timeslot entry
        let from = undefined;
        if (timeslot === 0) {
            from = fjob + ".0";
        }
        else {
            from = fjob.slice(0, 3).toUpperCase().replace(" ", "") + "." + timeslot;
        }
        let color = jobInfo[fjob].color;
        return { from: from, color: color };
    }
    function addSankeyConnection(fjob, tjob, timeslot, value, jobInfo) {
        // Make the "from" string, which is either, (CEO as example):
        // 0 CEO (0)     -> First entry
        // 0 (X)         -> Xth timeslot entry
        let from = undefined;
        if (timeslot === 0) {
            from = fjob + ".0";
        }
        else {
            from = fjob.slice(0, 3).toUpperCase().replace(" ", "") + "." + timeslot;
        }
        // Make the "to" string, which is similar to the second entry for "from", but one higher
        let to = tjob.slice(0, 3).toUpperCase().replace(" ", "") + "." + (timeslot + 1);
        // Color
        let color = jobInfo[tjob].color;
        // Return entry to the diagram
        return { from: from, to: to, value: value, color: color };
    }
    function updateChord(emails, lookup) {
        amChartChord_1.default.startAngle = 180;
        amChartChord_1.default.endAngle = amChartChord_1.default.startAngle + 180;
        let mg = new mailGraph_1.MailGraph(emails);
        let dateStrings = document.getElementById("calendar").value.split(" - ");
        mg.setDates(new Date(dateStrings[0]), new Date(dateStrings[1]));
        amChartChord_1.default.data = mg.generateJobChordInput(lookup);
    }
});
