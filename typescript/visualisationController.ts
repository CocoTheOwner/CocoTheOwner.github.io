import chordChart from "./amChartChord"
import withinJobChart from "./amChartChordJob"
import sankeyChart from "./amChartSankey"

window['colorData'] = {};
let inJobChartTitle = withinJobChart.titles.create();
inJobChartTitle.fontSize = 25;

export function updateCharts() {
    updateSankey();
    updateMainChord();
}

export function updateSankey(clusters = window["sClusters"]) {

    let maillist = window["emails"];
    if (!window["full-alluvial"]) {
        maillist = maillist.slice(findTimeIndex(window["startDate"]), findTimeIndex(window["endDate"]));
    }

    // Calculate the time between the first and last mail
    const timeframe = maillist[maillist.length - 1].date.getTime() - maillist[0].date.getTime();

    // Calculate the dates between which the clusters exist.
    const dates: Date[] = [] // Will contain as first element the first date and as the last, the last.
    for (let i = 0; i < clusters; i++) {
        dates[i] = new Date(maillist[0].date.getTime() + timeframe / clusters * (i+1));
    }

    // Loop over all mails and set counters, totals and colors
    sankeyChart.colors.reset();
    let mailCounters = {};
    let connections = {};
    let timeslot = 0;

    let firstIndex = findTimeIndex(maillist[0].date);
    for (const date of dates) {
        let lastIndex = findTimeIndex(date);
        mailCounters[timeslot] = { 'total': 0 };
        connections[timeslot] = {};

        for (let i = firstIndex; i <= lastIndex; i++) {
            // Get the mail
            let mail = window['emails'][i];

            // Get the job titles
            let fjob = window["lookup"][mail.fromId].jobTitle;
            let tjob = window["lookup"][mail.toId].jobTitle;

            mailCounters[timeslot]['total']++;

            // Make sure there is a section for the fromJob
            if (connections[timeslot][fjob] === undefined) connections[timeslot][fjob] = {};
    
            // Add one to the counter of the current fromJob->toJob
            if (connections[timeslot][fjob][tjob] === undefined) connections[timeslot][fjob][tjob] = 1;
            else connections[timeslot][fjob][tjob]++;
        }

        firstIndex = lastIndex + 1;
        timeslot++;
    }

    // Reset sankey data
    sankeyChart.data = [];

    // First job that we're certain exists in the left column \a\
    let backupJob;

    // Make sure the colors in the first column are set correctly
    for (const fjob in window['colorData']) {
        if (fjob in connections[0]) {
            sankeyChart.data.push(addSankeyColor(fjob));
        }
    }

    let lastLinks = {};

    // For all connections between columns...
    for (const timeslot in mailCounters) {

        // Get total for timeslot
        const timeslotTotal = mailCounters[timeslot]["total"]

        // Keep track of one of the job titles present on the left of the current cluster \a\
        for (const fjob in connections[timeslot]) {
            backupJob = fjob;
            break;
        }

        // Dictionary to store the links we have to draw. \b\
        let links = {};

        for (const fjob in connections[timeslot]) {

            // Create links for all outgoing links from left to right
            for (const tjob in connections[timeslot][fjob]) {
                if (links[tjob] === undefined) links[tjob] = [];
                links[tjob].push(addSankeyConnection(fjob, tjob, parseInt(timeslot), connections[timeslot][fjob][tjob], timeslotTotal));
            }

            // In case there are nodes on the left that are not supported, support them so they don't 'fall' further to the left. \a\
            for (const tjob in connections[parseInt(timeslot) + 1]) {
                if (links[tjob] === undefined) {
                    links[tjob] = [{
                        from: backupJob + (parseInt(timeslot) === 0 ? "" : "." + timeslot),
                        to: tjob + "." + (parseInt(timeslot) + 1),
                        color: window['colorData'][tjob]
                    }];
                }
            }
        }

        if (parseInt(timeslot) != parseInt(window['sClusters']) - 1) {
            for (const tjob in window['colorData']) {
                if (tjob in links) {
                    for (const link of links[tjob]) {
                        sankeyChart.data.push(link);
                    }
                }
            }
        } else {
            lastLinks = links;
        }
    }

    // Make it so that the rightmost cluster features all job titles instead of the leftmost.
    // The rightmost cluster usually has more nodes and some space leftover to the right of it.
    // Moving the cluster with job title descriptions to the right fills this space and saves computations.
    for (const tjob in window['colorData']) {
        if (tjob in lastLinks) {
            for (const link of lastLinks[tjob]) {
                sankeyChart.data.push(link);
            }
        } else {
            sankeyChart.data.push({from: backupJob + (clusters === 1 ? "" : "." + (clusters - 1)), to: tjob + "." + clusters, color: window["colorData"][tjob]});
        }
    }

    sankeyChart.validateData(); // Updates the sankeyChart
    removeSankeyLabels(sankeyChart);
}

//make a sankey data entry to give the first layer a color
function addSankeyColor(fjob: string): {from: string, color} {
    return {from: fjob, color: window["colorData"][fjob]}
}

function addSankeyConnection(fjob, tjob: string, timeslot, part, total: number): {from, to: string, value, total: number, color} {
    // Make the "from" string, which is either, (CEO as example):
    // 0 CEO (0)     -> First entry
    // 0 (X)         -> Xth timeslot entry
    let from = undefined
    if (timeslot === 0) { 
        from = fjob
    }
    else {
        from = fjob + "." + timeslot;
    }
    
    // Make the "to" string, which is similar to the second entry for "from", but one higher
    let to = tjob + "." + (timeslot + 1)

    let fraction = part / total

    // Return entry to the diagram


    return{from:from, to:to, value:fraction, color:window["colorData"][tjob], total: part}

}

export function updateMainChord() {
    chordChart.startAngle = 180;
    chordChart.endAngle = chordChart.startAngle + 180;

    // Set the values for where and how wide the bar above the alluvial diagram should be
    if (window["full-alluvial"]) {
        let totalMillis = window["emails"][window["emails"].length - 1].date.getTime() - window["emails"][0].date.getTime();
        window['sankeyFractions'][0] = (window["startDate"].getTime() - window["emails"][0].date.getTime()) / totalMillis;
        window['sankeyFractions'][1] = (window["endDate"].getTime() - window["emails"][0].date.getTime()) / totalMillis;
    } else {
        window['sankeyFractions'][0] = 0
        window['sankeyFractions'][1] = 1
    }

    let startIndex = findTimeIndex(window["startDate"])
    let endIndex = findTimeIndex(window["endDate"])

    chordChart.data = []
    let data = {}
    let sentiments = {}
    for(let i = startIndex; i < endIndex; i++){
        let mail = window["emails"][i]
        let from = window["lookup"][mail.fromId].jobTitle
        let to = window["lookup"][mail.toId].jobTitle

        if (from == to) { continue }

        if (data[from] != undefined && data[from][to] != undefined) { // if an entry from -> to exists add to that
            data[from][to]++
            sentiments[from][to] = (sentiments[from][to] + mail.appreciation) / 2;
        } else if (data[to] != undefined && data[to][from] != undefined) { // if not, try with to -> from
            data[to][from]++
            sentiments[to][from] = (sentiments[to][from] + mail.appreciation) / 2;
        }else {      // both dont? create from -> to
            data[from] == undefined ? data[from] = {[to]: 1} : data[from][to] = 1
            sentiments[from] == undefined ? sentiments[from] = {[to]: mail.appreciation} : sentiments[from][to] = mail.appreciation;
        }
    }
    
    for (let job in window["colorData"]) {
        chordChart.data.push({from: job, color: window["colorData"][job]})
    }

    for (let from in data) {
        for (let to in data[from]) {
            chordChart.data.push({from: from, to: to, value: data[from][to], sentiment: sentiments[from][to]})
        }
    }

    chordChart.validateData(); // Updates the chord diagram
    
    updateJobChord();
}

export function updateJobChord() {
    withinJobChart.startAngle = 180;
    withinJobChart.endAngle = withinJobChart.startAngle + 180;
    
    inJobChartTitle.text = "Within job title: " + window["selectedJob"];
    
    let startIndex = findTimeIndex(window["startDate"])
    let endIndex = findTimeIndex(window["endDate"])
    
    withinJobChart.data = []
    let data = {}
    let sentiments = {};
    for(let i = startIndex; i < endIndex; i++){
        let mail = window["emails"][i]
        let from = mail.fromId
        let to = mail.toId
        if (window["lookup"][from].jobTitle == window["selectedJob"] && window["lookup"][to].jobTitle == window["selectedJob"] && (!(from == to) || window['self-edge'])) {
            if (data[from] != undefined && data[from][to] != undefined) { // if an entry from-> to exists add to that
                data[from][to]++
                sentiments[from][to] = (sentiments[from][to] + mail.appreciation) / 2;
            } else if (data[to] != undefined && data[to][from] != undefined) { // if not, try with to -> from
                data[to][from]++
                sentiments[to][from] = (sentiments[to][from] + mail.appreciation) / 2;
            } else {      // both dont? create from -> to
                data[from] == undefined ? data[from] = {[to]: 1} : data[from][to] = 1
                sentiments[from] == undefined ? sentiments[from] = {[to]: mail.appreciation} : sentiments[from][to] = mail.appreciation;
            }
        }
    }

    for(let from in data){
        for(let to in data[from]){
            let fromName = getNameFromEmail(window["lookup"][from].email);
            let toName = getNameFromEmail(window["lookup"][to].email);
            withinJobChart.data.push({from: fromName, to: toName, value: data[from][to], sentiment: sentiments[from][to]})
        }
    }

    withinJobChart.validateData(); // Updates the chord diagram
}

function removeSankeyLabels(sankeyChart){
    sankeyChart.nodes.each(function(key, node) {
        node.nameLabel.label.text = key.split(".")[0]
        if (!key.includes("." + window['sClusters'])){
            node.nameLabel.label.disabled = true
        }
    })
}

function getNameFromEmail(email: string): string {
    let first = email.split("@")[0];
    let parts = first.split(".");
    let lastname = parts.pop();
    
    if (parts.length > 0) {
        return parts[0][0].toUpperCase() + ". " + lastname[0].toUpperCase() + lastname.substr(1);
    } else {
        return lastname[0].toUpperCase() + lastname.substr(1);
    }
}

//finds first email sent on/after a date
//params:
//  -date:    date to find (if Date(0), returns first element; if Date(1), return last+1th)
//returns:
//  -index of mail found
export function findTimeIndex(date: Date): number {
    if (date.getTime() === 0) { return 0; }                     // Special case: Return the first element of the array
    else if (date.getTime() === 1) { return window["emails"].length; }   // Special case: Return the length of the array
    else {                                                      // Normal case: Perform binary search to find the correct indices.
        let l = 0;
        let r = window["emails"].length - 1;

        // While true, keep searching
        while(l <= r) {
            let m = Math.floor((l + r) / 2);    //find middle of search area
            if (window["emails"][m].date < date) { l = m + 1; }
            else if (window["emails"][m].date > date) { r = m - 1; }
            else {
                // If we found the right date, look for duplicates that may occur before the current item.
                while (m > 0 && window["emails"][--m].date.toDateString() === date.toDateString()){};

                // Return the index of the first occurrance of our date.
                return m + 1;
            }
        }

        // If we did not find our date in the array, return the first mail after what we looked for.
        return r + 1;
    }
}