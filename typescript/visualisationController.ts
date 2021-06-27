import chordChart from "./amChartChord"
import withinJobChart from "./amChartChordJob"
import sankeyChart from "./amChartSankey"

let lookup;
let inJobChartTitle = withinJobChart.titles.create();
inJobChartTitle.fontSize = 25;

export function updateCharts() {
    updateSankey();
    updateMainChord();
}

export function updateSankey(clusters = window["sClusters"]): void {

    let maillist = window["emails"]
    if (!window["full-alluvial"]){
        maillist = maillist.slice(findTimeIndex(window["startDate"]), findTimeIndex(window["endDate"]))
    }

    // Calculate the time between the first and last mail
    const timeframe = maillist[maillist.length - 1].date.getTime() - maillist[0].date.getTime()

    // Calculate the dates between which the clusters exist.
    const dates = [] // Will contain as first element the first date and as the last, the last.
    for (let i = 0; i < clusters; i++) {
        dates[i] = maillist[0].date.getTime() + timeframe / clusters * (i+1)
    }

    // Loop over all mails and set counters, totals and colors
    window["colorData"] = {}
    sankeyChart.colors.reset()
    let mailCounters = {0: {"total":1}}
    let timeslot = 0
    for (let mailNum in maillist){

        // Get the mail
        let mail = maillist[mailNum]

        // Get the job titles
        let fjob = window["lookup"][mail.fromId].jobTitle
        let tjob = window["lookup"][mail.toId].jobTitle

        // Check if the f/tjobs are in the jobID list, and add them if not
        if (window["colorData"][fjob] === undefined) {
        }
        if (window["colorData"][tjob] === undefined) {
            window["colorData"][tjob] = sankeyChart.colors.next()
        }

        // Get the date (as a numeric value)
        let date = mail.date.getTime()

        // Check if we are in the next timeslot
        if (date > dates[timeslot]){
            timeslot++
            mailCounters[timeslot] = {"total": 0}
        }

        // Add one to the counter of the current timeslot
        mailCounters[timeslot]["total"]++

        // Make sure there is a section for the fromJob
        if (mailCounters[timeslot][fjob] === undefined) mailCounters[timeslot][fjob] = {}

        // Add one to the counter of the current fromJob->toJob
        if (mailCounters[timeslot][fjob][tjob] === undefined) mailCounters[timeslot][fjob][tjob] = 1
        else mailCounters[timeslot][fjob][tjob]++
    }

    // Reset sankey data
    sankeyChart.data = []

    // Calculate fractions per job for the timeslot it is in
    for (let timeslot in mailCounters){

        // Get total for timeslot
        let timeslotTotal = mailCounters[timeslot]["total"]

        // Loop over all jobs and get their total (in the timeslot) and calculate&save fraction
        for (let fjob in window["colorData"]){

            if (timeslot == "0"){
                 sankeyChart.data.push(addSankeyColor(fjob))
            }


            // Make sure the dict exists
            if (mailCounters[timeslot][fjob] === undefined) mailCounters[timeslot][fjob] = {}

            // Loop over the to jobs
            for (let tjob in window["colorData"]){

                // Retrieve the job total if it exists, else 0
                let jobTotal = mailCounters[timeslot][fjob][tjob] ? mailCounters[timeslot][fjob][tjob] : 0

                // Calculate the fraction for the timeslot

                // add the number to sankey
                sankeyChart.data.push(addSankeyConnection(fjob, tjob, Number(timeslot), jobTotal, timeslotTotal))
            }
        }
    }

    sankeyChart.validateData(); // Updates the sankeyChart
    removeSankeyLabels(sankeyChart);
}

//make a sankey data entry to give the first layer a color
function addSankeyColor(fjob: string): {from: string, color} {
    return {from: fjob, color: window["colorData"][fjob]}
}

function addSankeyConnection(fjob: string, tjob: string, timeslot: number, part: number, total: number): {from: string, to: string, value: number, total: number, color} {
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

    let totalMillis = window["emails"][window["emails"].length - 1].date.getTime() - window["emails"][0].date.getTime();
    window['sankeyFractions'][0] = (window["startDate"].getTime() - window["emails"][0].date.getTime()) / totalMillis;
    window['sankeyFractions'][1] = (window["endDate"].getTime() - window["emails"][0].date.getTime()) / totalMillis;

    let startIndex = findTimeIndex(window["startDate"])
    let endIndex = findTimeIndex(window["endDate"])
    
    if (startIndex === endIndex) {
        alert("The time interval you have chosen encompasses no data in the current dataset. The visualization has not been changed.");
        return;
    }

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
        if (key.includes(".")){
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
//  -date:    date to find (if Date(0), returns first element; if Date(1), return last)
//returns:
//  -index of mail found
function findTimeIndex(date: Date): number {
    if (date.getTime() === 0) { return 0; }                     // Special case: Return the first element of the array
    else if (date.getTime() === 1) { return window["emails"].length; }   // Special case: Return the last element of the array
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