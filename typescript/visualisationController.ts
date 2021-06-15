import chordChart from "./amChartChord"
import withinJobChart from "./amChartChordJob"
import sankeyChart from "./amChartSankey"
import { Email, Employee } from "./csvParser"
import { findTimeIndex } from "./mailGraph"

let lookup;
let inJobChartTitle = withinJobChart.titles.create();
inJobChartTitle.fontSize = 25;

export function updateCharts(sankeyClusters = 8, sankeyBarFractions: number[]): void {
    let emails = window["emails"]
    lookup = window["lookup"]

    updateSankey(emails, lookup, sankeyClusters)
    updateMainChord(emails, lookup, sankeyBarFractions)

    sankeyChart.validateData(); // Updates the sankeyChart

    removeSankeyLabels(sankeyChart)
}

function updateSankey(emails: Email[], lookup: {[id: number]: Employee}, clusters = 8): void {

    // Calculate the time between the first and last mail
    const timeframe = emails[emails.length - 1].date.getTime() - emails[0].date.getTime()

    // Calculate the dates between which the clusters exist.
    const dates = [] // Will contain as first element the first date and as the last, the last.
    for (let i = 0; i < clusters; i++) {
        dates[i] = emails[0].date.getTime() + timeframe / clusters * (i+1)
    }

    // Loop over all mails and set counters, totals and colors
    window["colorData"] = {}
    sankeyChart.colors.reset()
    let mailCounters = {0: {"total":1}}
    let timeslot = 0
    for (let mailNum in emails){

        // Get the mail
        let mail = emails[mailNum]

        // Get the job titles
        let fjob = lookup[mail.fromId].jobTitle
        let tjob = lookup[mail.toId].jobTitle

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
}

//make a sankey data entry to give the first layer a color
function addSankeyColor(fjob: string): {from: string, color}{
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

export function updateMainChord(emails: Email[], lookup: {[id: number]: Employee}, sankeyBarFractions: number[]): void {
    chordChart.startAngle = 180;
    chordChart.endAngle = chordChart.startAngle + 180;

    let totalMillis = emails[emails.length - 1].date.getTime() - emails[0].date.getTime();
    sankeyBarFractions.push((window["startDate"].getTime() - emails[0].date.getTime()) / totalMillis);
    sankeyBarFractions.push((window["endDate"].getTime() - emails[0].date.getTime()) / totalMillis);

    let startIndex = findTimeIndex(emails, window["startDate"])
    let endIndex = findTimeIndex(emails, window["endDate"])

    chordChart.data = []
    let data = {}
    for(let i = startIndex; i < endIndex; i++){
        let mail = emails[i]
        let from = lookup[mail.fromId].jobTitle
        let to = lookup[mail.toId].jobTitle

        if(from == to){ continue }

        if(data[from] != undefined && data[from][to] != undefined){ // if an entrie from-> to exists add to that
            data[from][to]++
        }else if(data[to] != undefined && data[to][from] != undefined){ // if not, try with to -> from
            data[to][from]++
        }else {      // both dont? create from -> to
            data[from] == undefined ? data[from] = {[to]: 1} : data[from][to] = 1
        }
    }

    for(let job in window["colorData"]){
        chordChart.data.push({from: job, color: window["colorData"][job]})
    }

    for(let from in data){
        for(let to in data[from]){
            chordChart.data.push({from: from, to: to, value: data[from][to]})
        }
    }

    chordChart.validateData(); // Updates the chord diagram

    updateJobChord();
}

export function updateJobChord() {
    withinJobChart.startAngle = 180;
    withinJobChart.endAngle = withinJobChart.startAngle + 180;

    inJobChartTitle.text = "Within job title: " + window["selectedJob"];

    let emails = window["emails"]
    let startIndex = findTimeIndex(emails, window["startDate"])
    let endIndex = findTimeIndex(emails, window["endDate"])

    withinJobChart.data = []
    let data = {}
    for(let i = startIndex; i < endIndex; i++){
        let mail = emails[i]
        let from = mail.fromId
        let to = mail.toId
        if (lookup[from].jobTitle == window["selectedJob"] && lookup[to].jobTitle == window["selectedJob"] && from != to) {
            if (data[from] != undefined && data[from][to] != undefined) { // if an entrie from-> to exists add to that
                data[from][to]++
            } else if (data[to] != undefined && data[to][from] != undefined) { // if not, try with to -> from
                data[to][from]++
            } else {      // both dont? create from -> to
                data[from] == undefined ? data[from] = {[to]: 1} : data[from][to] = 1
            }
        }
    }

    for(let from in data){
        for(let to in data[from]){
            withinJobChart.data.push({from: from, to: to, value: data[from][to]})
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