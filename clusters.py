import networkx as nx
import random as r

G = nx.Graph()


def distance(x,y):  #to be defined
    pass


def pickNode(graph):    #picks a node, paper uses random, should we?
    return r.choice(graph.nodes)

#create a cluster around the center node, t is distance
def stoQuery(graph, t, center):
    Q = [center]    # weird way to implement queue quickly, list with index, high mem, so should be replaced
    c = 0           # index of said queue
    cluster = [center]
    while c < len(Q):   #until end of queue
        node = Q[c]     #get queue element
        c += 1
        for i in list(graph.adj[node]):     # for loop over neighbours
            if i not in cluster and distance(center,i) < t: #add to cluster if distance is less then t
                cluster.append(i)
                Q.append(i)
    return cluster



#create entire clustering from graph
def stoC(graph, t):
    G2 = G.copy()   # get copy of Graph, dont want to modify original
    clustering = [] # list of clusters
    while len(G2.nodes) > 0:    # we remove nodes that we put in clusters, keep going until all is in a cluster
        node = pickNode(G2)
        cluster = stoQuery(G2, t, node)
        G2.remove_nodes_from(cluster)   # remove nodes
        clustering.append(cluster)      # add cluster to list
    return clustering



