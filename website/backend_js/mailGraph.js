define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MailGraph = void 0;
    /** A class representing a directed graph for email traffic. */
    var MailGraph = /** @class */ (function () {
        /**
         * Create a new graph based on an interval between two dates.
         * If any one of the indices is not given, we assume the beginning/end of time.
         *
         * Please remember that the `to` time is _exclusive_. E-mails from this day are **not** added.
        */
        function MailGraph(mailArr, from, to) {
            if (from === void 0) { from = new Date(0); }
            if (to === void 0) { to = new Date(1); }
            this.graph = {};
            this.emails = mailArr;
            var startIndex = findTimeIndex(mailArr, from);
            var endIndex = findTimeIndex(mailArr, to);
            // Loop through all emails in the interval
            while (startIndex < endIndex) {
                var mail = this.emails[startIndex++];
                // If this is fromId's first mail, add fromId to the graph as a node.
                if (!(mail.fromId in this.graph)) {
                    this.graph[mail.fromId] = {};
                }
                // If this mail is the first fromId->toId mail, add toId to fromId's neighbours
                if (!(mail.toId in this.graph[mail.fromId])) {
                    this.graph[mail.fromId][mail.toId] = [];
                }
                this.graph[mail.fromId][mail.toId].push(mail.appreciation);
            }
        }
        // Add a new edge (email) to the graph.
        // If any one of the required nodes is missing, they are added.
        MailGraph.prototype.addMail = function (mail) {
            this.graph[mail.fromId][mail.toId].push(mail.appreciation);
        };
        MailGraph.prototype.copynodes = function () {
            var nodes = [];
            for (var key in this.graph) {
                nodes.push(parseInt(key));
            }
            return nodes;
        };
        MailGraph.prototype.neighbours = function (node) {
            var neighbours = [];
            for (var key in this.graph[node]) {
                neighbours.push(parseInt(key));
            }
            return neighbours;
        };
        /**
         * Distance function
         * Input: ID's of two employees, A and B
         * Output: #emails A->B + #emails B->A
        */
        MailGraph.prototype.distance = function (employeeA, employeeB) {
            var count = 0;
            // Number of emails from A to B
            try { //dirty check to prevent non existant mails
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
        MailGraph.prototype.clusterDist = function (c1, c2) {
            var dist = 0;
            for (var _i = 0, c1_1 = c1; _i < c1_1.length; _i++) {
                var i = c1_1[_i];
                for (var _a = 0, c2_1 = c2; _a < c2_1.length; _a++) {
                    var j = c2_1[_a];
                    dist += this.distance(i, j);
                }
            }
            return dist;
        };
        return MailGraph;
    }());
    exports.MailGraph = MailGraph;
    /**
     * Finds the index of the first or last mail sent on the specified date, based on whether we look on the low end or the high end.
     * If no such date exists, the index of the date right after what we looked for is returned.
     * lowEnd does not have to be specified. If it isn't, default value `true` will be used.
     *
     * Two special cases are included for returning the first and last index of the array:
     * ```let i1 = findTimeIndex(new Date(0));  // Returns 0```
     * ```let i2 = findTimeIndex(new Date(1));  // Returns emails.length```
    */
    function findTimeIndex(mailArr, date) {
        if (date.getTime() === 0) { // Special case: Return the first element of the array
            return 0;
        }
        else if (date.getTime() === 1) { // Special case: Return the last element of the array
            return mailArr.length;
        }
        else { // Normal case: Perform binary search to find the correct indices.
            var l = 0;
            var r = mailArr.length - 1;
            // While true, keep searching
            while (l <= r) {
                var m = Math.floor((l + r) / 2);
                if (mailArr[m].date < date) {
                    l = m + 1;
                }
                else if (mailArr[m].date > date) {
                    r = m - 1;
                }
                else {
                    // If we found the right date, look for duplicates that may
                    //   occur before or after the current item.
                    while (mailArr[--m].date.getTime() === date.getTime()) { }
                    ;
                    // Return the index of the first or last occurrance of our date.
                    // First if we look for a date on the low end, last if not.
                    return m + 1;
                }
            }
            // If we did not find our date in the array, return the next acceptable thing.
            // Return the first date after what we looked for.
            return r + 1;
        }
    }
});
