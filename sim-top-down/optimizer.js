p = console.log;
console.log("hello")

function square(x) {
    return x * x;
}

/* Score how close vals is to the goal */
function score(goal, vals) {
    sum_of_squares = 0.0;
    for ( var i=0 ; i < goal.length ; i++ ){
        sum_of_squares += square(goal[i] - vals[i]);
    }
    return Math.sqrt(sum_of_squares);
}

/* Given a goal and a current set of vals, evaluate all possible moves on vals and return the best new set */
function optimize1(goal, vals) {
    // Start with the current position
    var best_score = score(goal, vals); 
    var best_vals  = vals;

    // Evaluate every possible move and find the one that produces the lowest score
    for ( var from_ = 0; from_ < vals.length ; from_++ ) {
        for ( var to_ = 0; to_ < vals.length; to_++ ) {
            if ( from_ == to_ ) continue;   // doesn't move anywhere
            if ( vals[from_] < 1) continue; // none to move
            nvals = [...vals];              // copy the array
            nvals[to_] += 1;                // make the move
            nvals[from_] -= 1;
            nvals_score = score(goal, nvals); // score it
            if (best_score > nvals_score) {   // found a better score
                best_score = nvals_score;
                best_vals  = nvals;
            }
        }
    }
    return best_vals;
}

/* Run the optimizer until the array is unchanged or we run out of steps */
MAX_STEPS=1000;
function optimize(goal, vals){
    p(goal,'<-',vals);
    for (var i=0; i<MAX_STEPS; i++) {
        nvals = optimize1(goal, vals);
        if (vals==nvals) {
            break;
        }
        vals = nvals;
    }
    // Ran too long; return last optimization
    p('   -> ', nvals);
    return nvals
}

goal = [1,2,3,4,5,6];
v1 = [3,2,1,0,3,6];
v2 = 

vn = optimize(goal, [99,0,0,0,0,0]);
vn = optimize(goal, [0,0,10,0,0,0]);
vn = optimize(goal, [0,0,0,0,0,10]);

//optimize1(goal, v1);
