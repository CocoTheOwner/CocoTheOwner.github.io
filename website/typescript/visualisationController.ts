import {chart as chordChart} from "./amChartChord"
import {chart as sankeyChart} from "./amChartSankey"
import {Email, Employee} from "./csvParser"
// import {MailGraph, findTimeIndex} from "./MailGraph"
export function updateCharts(emails: Email[], lookup: {[id: number]: Employee}): void {

    // Mailcap
    const mailCap = emails.length;
    
    emails.sort(function (e1, e2) { return e1.date.getTime() - e2.date.getTime(); });
    console.log(emails)
    // List job titles
    const jobtitles = ["Unknown", "Employee", "CEO", "Director", "Trader", "President", "Vice President", "Manager", "Managing Director", "In House Lawyer"]

    // Retrieve the first and last date in the sorted mails array
    const firstdate: Date = emails[0].date
    const lastdate: Date = emails[mailCap - 1].date

    // Set a default number for the amount of clusters
    var clusters: number = 8

    // Calculate the time between the first and last mail
    const timeframe = lastdate.getTime() - firstdate.getTime()

    // Calculate the dates between which the clusters exist.
    const dates = []
    for (let i = 0; i <= clusters; i++) {
        dates[i] = firstdate.getTime() + timeframe/clusters*i
    }

    // Loop over all mails and add them to their respective clusters
    var currentCluster = 0
    var mailnum = 0
    const splitMails = {}
    var clusterMail = []
    for (let i = 0; i < mailCap; i++){
        let mail = emails[i]
        let date = mail.date
        while (date.getTime() >= dates[currentCluster]){
            currentCluster += 1;
            console.log("Cluster " + currentCluster + " being filled.")
            splitMails[currentCluster] = clusterMail
            clusterMail = []
            mailnum = 0
        }
        clusterMail[clusterMail.length] = mail
    }
    splitMails[currentCluster] = clusterMail

    // Create a dictionary with the jobtitles stacked twice
    const jobsFromTo = []
    for (let i = 0; i < clusters; i++){
        jobsFromTo[i] = {}
        for (let job in jobtitles){
            jobsFromTo[i][jobtitles[job]] = {}
            for (let _job in jobtitles){
                jobsFromTo[i][jobtitles[job]][jobtitles[_job]] = []
            }
        }
    }

    // For each of the clusters
    for (let cluster = 0; cluster < clusters; cluster++) {
        // For each of the mails
        for (let mail in splitMails[cluster]){
            // Get from and to jobtitle
            var fromjob = lookup[splitMails[cluster][mail].fromId].jobTitle
            var tojob = lookup[splitMails[cluster][mail].toId].jobTitle

            // Store using the from and to job the mail counter
            jobsFromTo[cluster][fromjob][tojob].push(splitMails[cluster][mail])
        }
    }

    // Clear data
    sankeyChart.data = [];
    sankeyChart.colors.next()
    sankeyChart.colors.next()
    sankeyChart.colors.next()
    sankeyChart.data.push({"from":"Unknown (0)", color:sankeyChart.colors.next()})
    // colors
    const colors = {};
    // Assign colors to the jobtitles (so each title has the same color)
    for (let fjob in jobtitles){
        colors[jobtitles[fjob]] = sankeyChart.colors.black
    }

    // Set the data from the job clusters in the chart
    for (let i in jobsFromTo) {
        for (let fjob in jobsFromTo[i]){
            for (let tjob in jobsFromTo[i][fjob]){
                sankeyChart.data.push({from: fjob + " (" + i + ")", to: tjob + " (" +String(Number(i)+1) + ")", value: jobsFromTo[i][fjob][tjob].length, nodeColors:colors[jobtitles[fjob]]})
            }
        }
    }


    sankeyChart.validateData(); // Updates the sankeyChart
    // chordChart.validateData(); // Updates the chord diagram
}	