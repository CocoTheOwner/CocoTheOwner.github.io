"use strict";
exports.__esModule = true;
exports.MailGraph = void 0;
//a class holding a directed graph for email traffic
var MailGraph = /** @class */ (function () {
    //Mailgraph constructor
    //params:
    //  -mailArr: email array to create graph from (sorted for filters)
    //  -from:    filters from this date (inclusive) (default = all)
    //  -to:      filters up until this date (exclusive) (default = all)
    function MailGraph(mailArr, from, to) {
        if (from === void 0) { from = new Date(0); }
        if (to === void 0) { to = new Date(1); }
        this.graph = {};
        this.emails = mailArr;
        //find indexes of filter
        var startIndex = findTimeIndex(mailArr, from);
        var endIndex = findTimeIndex(mailArr, to);
        // Loop through all emails in the interval
        for (var i = startIndex; i < endIndex; i++) {
            var mail = this.emails[i];
            // If this is fromId's first mail, add fromId to the graph as a node.
            if (!(mail.fromId in this.graph)) {
                this.graph[mail.fromId] = {};
            }
            // If this mail is the first fromId->toId mail, add toId to fromId's neighbours
            if (!(mail.toId in this.graph[mail.fromId])) {
                this.graph[mail.fromId][mail.toId] = [];
            }
            //add the mail as an edge
            this.graph[mail.fromId][mail.toId].push(mail.appreciation);
        }
    }
    //add single mail to graph (and nodes if they are missing)
    //params:
    //  -mail: email to be added
    //returns: nothing
    MailGraph.prototype.addMail = function (mail) {
        this.graph[mail.fromId][mail.toId].push(mail.appreciation);
    };
    //create a copy of this graphs nodes
    //returns:
    //  -array of nodes
    MailGraph.prototype.copynodes = function () {
        var nodes = [];
        for (var key in this.graph) {
            nodes.push(parseInt(key)); //apperently keys must be strings ._.
        }
        return nodes;
    };
    //get all neighbours of a node
    //params:
    //  -node: node to get the neigbours of
    //returns:
    //  -array of nodes
    MailGraph.prototype.neighbours = function (node) {
        var neighbours = [];
        for (var key in this.graph[node]) {
            neighbours.push(parseInt(key)); //again keys are str, so parse to int
        }
        return neighbours;
    };
    //distance between 2 nodes
    //params:
    //  -employeeA/B: nodes to calc distance between
    //returns:
    //  -amount of mails sent between a and b
    MailGraph.prototype.distance = function (employeeA, employeeB) {
        var count = 0;
        // Number of emails from A to B
        try { //dirty check to prevent error if no mails were sent from a to b
            count += this.graph[employeeA][employeeB].length;
        }
        catch (_a) { }
        // Number of emails from B to A
        try {
            count += this.graph[employeeB][employeeA].length;
        }
        catch (_b) { }
        return count;
    };
    //distance of 2 clusters (for edgebundling)
    //params:
    //  -clusterA/B: clusters to calc distance between
    //returns:
    //  -amount of mails sent between a and b
    MailGraph.prototype.clusterDist = function (clusterA, clusterB) {
        var dist = 0;
        for (var _i = 0, clusterA_1 = clusterA; _i < clusterA_1.length; _i++) {
            var i = clusterA_1[_i];
            for (var _a = 0, clusterB_1 = clusterB; _a < clusterB_1.length; _a++) {
                var j = clusterB_1[_a];
                dist += this.distance(i, j);
            }
        }
        return dist;
    };
    return MailGraph;
}());
exports.MailGraph = MailGraph;
//finds first email sent on/after a date
//params:
//  -mailArr: the array to find the mail in
//  -date:    date to find (if Date(0), returns first element; if Date(1), return last)
//returns:
//  -index of mail found
function findTimeIndex(mailArr, date) {
    if (date.getTime() === 0) {
        return 0;
    } // Special case: Return the first element of the array
    else if (date.getTime() === 1) {
        return mailArr.length;
    } // Special case: Return the last element of the array
    else { // Normal case: Perform binary search to find the correct indices.
        var l = 0;
        var r = mailArr.length - 1;
        // While true, keep searching
        while (l <= r) {
            var m = Math.floor((l + r) / 2); //find middle of search area
            if (mailArr[m].date < date) {
                l = m + 1;
            }
            else if (mailArr[m].date > date) {
                r = m - 1;
            }
            else {
                // If we found the right date, look for duplicates that may occur before the current item.
                while (mailArr[--m].date.toDateString() === date.toDateString()) { }
                ;
                // Return the index of the first occurrance of our date.
                return m + 1;
            }
        }
        // If we did not find our date in the array, return the first mail after what we looked for.
        return r + 1;
    }
}
