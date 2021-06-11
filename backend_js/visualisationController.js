define(["require", "exports", "./amChartChord", "./amChartChordJob", "./amChartSankey", "./mailGraph"], function (require, exports, amChartChord_1, amChartChordJob_1, amChartSankey_1, mailGraph_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.updateJobChord = exports.updateMainChord = exports.updateCharts = void 0;
    let lookup;
    let inJobChartTitle = amChartChordJob_1.default.titles.create();
    inJobChartTitle.fontSize = 25;
    function updateCharts(sankeyClusters = 8, sankeyBarFractions) {
        let emails = window["emails"];
        lookup = window["lookup"];
        updateSankey(emails, lookup, sankeyClusters);
        updateMainChord(emails, lookup, sankeyBarFractions);
        amChartSankey_1.default.validateData(); // Updates the sankeyChart
        removeSankeyLabels(amChartSankey_1.default);
    }
    exports.updateCharts = updateCharts;
    function updateSankey(emails, lookup, clusters = 8) {
        // Calculate the time between the first and last mail
        const timeframe = emails[emails.length - 1].date.getTime() - emails[0].date.getTime();
        // Calculate the dates between which the clusters exist.
        const dates = []; // Will contain as first element the first date and as the last, the last.
        for (let i = 0; i < clusters; i++) {
            dates[i] = emails[0].date.getTime() + timeframe / clusters * (i + 1);
        }
        // Loop over all mails and set counters, totals and colors
        window["colorData"] = {};
        amChartSankey_1.default.colors.reset();
        let mailCounters = { 0: { "total": 1 } };
        let timeslot = 0;
        for (let mailNum in emails) {
            // Get the mail
            let mail = emails[mailNum];
            // Get the job titles
            let fjob = lookup[mail.fromId].jobTitle;
            let tjob = lookup[mail.toId].jobTitle;
            // Check if the f/tjobs are in the jobID list, and add them if not
            if (window["colorData"][fjob] === undefined) {
            }
            if (window["colorData"][tjob] === undefined) {
                window["colorData"][tjob] = amChartSankey_1.default.colors.next();
            }
            // Get the date (as a numeric value)
            let date = mail.date.getTime();
            // Check if we are in the next timeslot
            if (date > dates[timeslot]) {
                timeslot++;
                mailCounters[timeslot] = { "total": 0 };
            }
            // Add one to the counter of the current timeslot
            mailCounters[timeslot]["total"]++;
            // Make sure there is a section for the fromJob
            if (mailCounters[timeslot][fjob] === undefined)
                mailCounters[timeslot][fjob] = {};
            // Add one to the counter of the current fromJob->toJob
            if (mailCounters[timeslot][fjob][tjob] === undefined)
                mailCounters[timeslot][fjob][tjob] = 1;
            else
                mailCounters[timeslot][fjob][tjob]++;
        }
        // Reset sankey data
        amChartSankey_1.default.data = [];
        // Calculate fractions per job for the timeslot it is in
        for (let timeslot in mailCounters) {
            // Get total for timeslot
            let timeslotTotal = mailCounters[timeslot]["total"];
            // Loop over all jobs and get their total (in the timeslot) and calculate&save fraction
            for (let fjob in window["colorData"]) {
                if (timeslot == "0") {
                    amChartSankey_1.default.data.push(addSankeyColor(fjob));
                }
                // Make sure the dict exists
                if (mailCounters[timeslot][fjob] === undefined)
                    mailCounters[timeslot][fjob] = {};
                // Loop over the to jobs
                for (let tjob in window["colorData"]) {
                    // Retrieve the job total if it exists, else 0
                    let jobTotal = mailCounters[timeslot][fjob][tjob] ? mailCounters[timeslot][fjob][tjob] : 0;
                    // Calculate the fraction for the timeslot
                    let fraction = jobTotal / timeslotTotal * 100;
                    // add the number to sankey
                    amChartSankey_1.default.data.push(addSankeyConnection(fjob, tjob, Number(timeslot), fraction));
                }
            }
        }
    }
    //make a sankey data entry to give the first layer a color
    function addSankeyColor(fjob) {
        return { from: fjob, color: window["colorData"][fjob] };
    }
    function addSankeyConnection(fjob, tjob, timeslot, value) {
        // Make the "from" string, which is either, (CEO as example):
        // 0 CEO (0)     -> First entry
        // 0 (X)         -> Xth timeslot entry
        let from = undefined;
        if (timeslot === 0) {
            from = fjob;
        }
        else {
            from = fjob + "." + timeslot;
        }
        // Make the "to" string, which is similar to the second entry for "from", but one higher
        let to = tjob + "." + (timeslot + 1);
        // Return entry to the diagram
        return { from: from, to: to, value: value, color: window["colorData"][tjob] };
    }
    function updateMainChord(emails, lookup, sankeyBarFractions) {
        amChartChord_1.default.startAngle = 180;
        amChartChord_1.default.endAngle = amChartChord_1.default.startAngle + 180;
        let totalMillis = emails[emails.length - 1].date.getTime() - emails[0].date.getTime();
        sankeyBarFractions.push((window["startDate"].getTime() - emails[0].date.getTime()) / totalMillis);
        sankeyBarFractions.push((window["endDate"].getTime() - emails[0].date.getTime()) / totalMillis);
        let startIndex = mailGraph_1.findTimeIndex(emails, window["startDate"]);
        let endIndex = mailGraph_1.findTimeIndex(emails, window["endDate"]);
        amChartChord_1.default.data = [];
        let data = {};
        for (let i = startIndex; i < endIndex; i++) {
            let mail = emails[i];
            let from = lookup[mail.fromId].jobTitle;
            let to = lookup[mail.toId].jobTitle;
            if (from == to) {
                continue;
            }
            if (data[from] != undefined && data[from][to] != undefined) { // if an entrie from-> to exists add to that
                data[from][to]++;
            }
            else if (data[to] != undefined && data[to][from] != undefined) { // if not, try with to -> from
                data[to][from]++;
            }
            else { // both dont? create from -> to
                data[from] == undefined ? data[from] = { [to]: 1 } : data[from][to] = 1;
            }
        }
        for (let job in window["colorData"]) {
            console.log(window["colorData"][job]);
            amChartChord_1.default.data.push({ from: job, color: window["colorData"][job] });
        }
        for (let from in data) {
            for (let to in data[from]) {
                amChartChord_1.default.data.push({ from: from, to: to, value: data[from][to] });
            }
        }
        console.log(amChartChord_1.default.data);
        amChartChord_1.default.validateData(); // Updates the chord diagram
        updateJobChord();
    }
    exports.updateMainChord = updateMainChord;
    function updateJobChord() {
        amChartChordJob_1.default.startAngle = 180;
        amChartChordJob_1.default.endAngle = amChartChordJob_1.default.startAngle + 180;
        inJobChartTitle.text = "Within job title: " + window["selectedJob"];
        let emails = window["emails"];
        let startIndex = mailGraph_1.findTimeIndex(emails, window["startDate"]);
        let endIndex = mailGraph_1.findTimeIndex(emails, window["endDate"]);
        amChartChordJob_1.default.data = [];
        let data = {};
        for (let i = startIndex; i < endIndex; i++) {
            let mail = emails[i];
            let from = mail.fromId;
            let to = mail.toId;
            if (lookup[from].jobTitle == window["selectedJob"] && lookup[to].jobTitle == window["selectedJob"] && from != to) {
                if (data[from] != undefined && data[from][to] != undefined) { // if an entrie from-> to exists add to that
                    data[from][to]++;
                }
                else if (data[to] != undefined && data[to][from] != undefined) { // if not, try with to -> from
                    data[to][from]++;
                }
                else { // both dont? create from -> to
                    data[from] == undefined ? data[from] = { [to]: 1 } : data[from][to] = 1;
                }
            }
        }
        for (let from in data) {
            for (let to in data[from]) {
                amChartChordJob_1.default.data.push({ from: from, to: to, value: data[from][to] });
            }
        }
        amChartChordJob_1.default.validateData(); // Updates the chord diagram
    }
    exports.updateJobChord = updateJobChord;
    function removeSankeyLabels(sankeyChart) {
        sankeyChart.nodes.each(function (key, node) {
            node.nameLabel.label.text = key.split(".")[0];
            if (key.includes(".")) {
                node.nameLabel.label.disabled = true;
            }
        });
    }
});
