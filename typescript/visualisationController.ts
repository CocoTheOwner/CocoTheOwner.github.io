import chordChart from "./amChartChord"
import sankeyChart from "./amChartSankey"
import {Email, Employee} from "./csvParser"
import { MailGraph } from "./mailGraph"


// import {MailGraph, findTimeIndex} from "./MailGraph"
export function updateCharts(sankeyClusters = 8): void {
    let emails = window["emails"]
    let lookup = window["lookup"]

    updateSankey(emails, lookup, sankeyClusters)
    updateChord(emails, lookup)

    sankeyChart.validateData(); // Updates the sankeyChart
}

function updateSankey(emails: Email[], lookup: {[id: number]: Employee}, clusters = 8): void {

    // Sort emails by date
    emails.sort(function (e1, e2) { return e1.date.getTime() - e2.date.getTime(); });

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
            window["colorData"][fjob] = sankeyChart.colors.next()
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
                let fraction = jobTotal / timeslotTotal * 100

                // add the number to sankey
                sankeyChart.data.push(addSankeyConnection(fjob, tjob, Number(timeslot), fraction))
            }
        }
    }
}
//make a sankey data entry to give the first layer a color
function addSankeyColor(fjob: string): {from: string, color}{
    return {from: fjob + ".0", color: window["colorData"][fjob]}
}

function addSankeyConnection(fjob: string, tjob: string, timeslot: number, value: number): {from: string, to: string, value: number, color} {
    // Make the "from" string, which is either, (CEO as example):
    // 0 CEO (0)     -> First entry
    // 0 (X)         -> Xth timeslot entry
    let from = undefined
    if (timeslot === 0) { 
        from = fjob + ".0"
    }
    else {
        from = fjob.slice(0, 3).toUpperCase().replace(" ", "") + "." + timeslot
    }
    
    // Make the "to" string, which is similar to the second entry for "from", but one higher
    let to = tjob.slice(0, 3).toUpperCase().replace(" ", "") + "." + (timeslot + 1)


    // Return entry to the diagram
    return{from:from, to:to, value:value, color:window["colorData"][tjob]}

}

export function updateChord(emails: Email[], lookup: {[id: number]: Employee}): void {
    chordChart.startAngle = 180;
    chordChart.endAngle = chordChart.startAngle + 180;

    let mg = new MailGraph(emails);
    let dateStrings = (<HTMLInputElement>document.getElementById("calendar")).value.split(" - ");

    mg.setDates(new Date(dateStrings[0]), new Date(dateStrings[1]));
    chordChart.data = mg.generateJobChordInput(lookup);
    chordChart.validateData(); // Updates the chord diagram
}