define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var cluster = /** @class */ (function () {
        function cluster() {
        }
        cluster.prototype.stoQuery = function (graph, nodes, t, center) {
            var Q = [center]; // queue of nodes to pass through
            var cluster = [center]; // cluster to return
            while (Q.length > 0) {
                var node = Q.shift(); // pop queue
                for (var _i = 0, _a = graph.neighbours(node); _i < _a.length; _i++) { // add neighbours that are not yet in and within dist
                    var employee = _a[_i];
                    if (!cluster.includes(employee) && !Q.includes(employee) && nodes.includes(employee) && graph.distance(center, employee) > t) {
                        cluster.push(employee);
                        Q.push(employee);
                    }
                }
            }
            return cluster;
        };
        cluster.prototype.pickNode = function (nodes) {
            return nodes[Math.floor(Math.random() * nodes.length)];
        };
        cluster.prototype.stoC = function (graph, t) {
            var nodes = graph.copynodes();
            var clustering = [];
            var _loop_1 = function () {
                var node = this_1.pickNode(nodes);
                var cluster_1 = this_1.stoQuery(graph, nodes, t, node); //get cluster
                nodes = nodes.filter(function (x) { return !cluster_1.includes(x); }); // remove from nodes
                clustering.push(cluster_1);
            };
            var this_1 = this;
            while (nodes.length > 0) {
                _loop_1();
            }
            return clustering;
        };
        cluster.prototype.clusterLinks = function (graph, clustering) {
            var links = [];
            for (var i = 0; i < clustering.length; i++) {
                var link = Array(i).fill(-1);
                for (var j = i + 1; j < clustering.length; j++) {
                    link.push(graph.clusterDist(clustering[i], clustering[j]));
                }
                links.push(link);
            }
            return links;
        };
        return cluster;
    }());
    exports.default = cluster;
});
