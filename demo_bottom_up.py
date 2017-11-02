#!/usr/bin/env python3
#
# Demonstrate the bottom-up mechanism

import math
import random
import numpy
import sys
import copy
if sys.version < '3':
    raise RuntimeError("Requires Python 3")

# Simple implementation of geometric noise generator

def geometric(p):
    x    = 1
    sum  = prod = p
    q    = 1.0 - p
    u    = random.random()
    while (sum < u):
        prod *= q
        sum  += prod
        x += 1
    return x

def geometric_noise(budget, sensitivity):
    e = budget / sensitivity
    p = 1.0 - math.exp(-e)
    x = geometric(p) - 1
    y = geometric(p) - 1
    return (x - y)

def privitize_categories(counts : dict, epsilon : float, sensitivity : int) -> dict:
    """Apply geometric noise to each of the counts, and then optimize to make all counts equal N"""
    real_total = sum( counts.values())

    # Add the noise to the counts and remember the noise
    pcounts = dict()
    noises = dict()
    for cat in counts.keys():
        noises[cat] = geometric_noise(epsilon,sensitivity)
        pcounts[cat] = counts[cat] +noises[cat]

    # If any of the values are negative, add a constant value to all of the values so that none are negative.
    # This prevents an initial split of (-100,100) from being changed to (0,100) and never recovering the 0 to a
    # higher number
    bias = min(pcounts.values())
    if bias < 0 :
        for cat in pcounts.keys():
            pcounts[cat] -= bias

    # Now repeat until there is no error
    assert min(pcounts.values()) >= 0
    while True:
        error = real_total - sum( pcounts.values())
        if error==0:
            break
        cat = random.choice( list( pcounts.keys()))
        pcounts[cat] = max( pcounts[cat] + numpy.sign(error), 0 )

    assert min(pcounts.values()) >= 0
    return (pcounts,noises)
        
def l1_error(acounts,bcounts):
    error = 0
    for key in set(list(acounts.keys()) + list(bcounts.keys())):
        error += math.fabs( acounts.get(key,0) - bcounts.get(key,0))
    return error
        

if __name__=="__main__":
    import argparse
    import sys
    import time

    parser = argparse.ArgumentParser(formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser.add_argument("--debug",action="store_true",help="write results to STDOUT")
    parser.add_argument("--epsilon","-e",type=float,default=1.0,help="Specify value of epsilon")
    parser.add_argument("--sensitivity","-s",type=int,default=1,help="Specify value of sensitivity")
    parser.add_argument("--integer","-i",action="store_true",
                        help="Force results to be integers (use geometric mechanism)")
    parser.add_argument("--seed",help="specify PRNG seed")
    parser.add_argument("--repeat","-r",help="repeat count",type=int,default=1)
    parser.add_argument("count1",help="category:count for the first category")
    parser.add_argument("count2",help="category:count for the second category")
    parser.add_argument("counts",nargs="*",help="Additional categories ...")
    
    args = parser.parse_args()
    seed = args.seed if args.seed else int(time.time())
    prng = numpy.random.RandomState(seed)
    
    # build the dictionary of 'category':count
    def csplit(s):
        (cat,count) = s.split(":")
        return (cat, int(count))
    
    counts = dict( [ csplit(args.count1), csplit(args.count2) ] + [csplit(c) for c in args.counts] )

    print(counts)
    print("Epsilon: {}  Sensitivity: {}".format(args.epsilon, args.sensitivity))
    for r in range( args.repeat ):
        (cpriv,noises) = privitize_categories(counts,args.epsilon, args.sensitivity)
        error = l1_error( counts, cpriv )
        fmt = " ".join(["{}:{}".format(k,cpriv[k]) for k in sorted(cpriv.keys())])
        print("Run {}:  Error: {}  counts: {}".format(r+1,error,fmt))


