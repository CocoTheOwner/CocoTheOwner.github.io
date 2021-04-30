# Trying to find some patterns in the data set and seeing what we are dealing with.
# This file will be deleted at some point.
# If I find something useful, I will see if it can be implemented faster in JS.

import pandas as pd

df = pd.read_csv("enron-v1.csv")

m = df.fromId.count() # number of edges 31041
n = len(set(df.fromId)) # number of nodes 147

print (m, n)

