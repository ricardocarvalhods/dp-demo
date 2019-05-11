p = console.log;
console.log("hello")

/****************************************************************/
// Privacy Functions
// From wikipedia:
// Lap(X) = mu - b sgn(U) ln (1-2|U|) where U is a random variable between -0.5 and 0.5

/* Sign function */
function sgn(x) {
    return x < 0 ? -1 : 1;
}

/* Laplace distribution */
function laplace(mu, b) {
    var U = Math.random() - 0.5;
    return mu - (b * sgn(U) * Math.log(1 - 2 * Math.abs(U)));
}

/* Laplace noise for a specific privacy budget and sensitivity */
function laplace_noise(budget, sensitivity ) {
    return laplace(0.0, (sensitivity / budget));
}

/* Privitize an array of counts (histogram) exploiting parallel composition */
function privitize_array(vars, epsilon) {
    return vars.map( function(a) {
        return a + laplace_noise(epsilon, 1);
    });
}

/****************************************************************/


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

// concatenate multiple arrays together
function concat() {
    var a = [];
    for (var i=0; i< arguments.length; i++){
        a = a.concat(arguments[i]);
    }
    return a
}

// equal two arrays; python does this for us!
function equal(a,b) {
    if ( a.length != b.length) return false; 
    for (var i=0; i< a.length; i++) {
        if (a[i] != b[i]) return false;
    }
    return true;
}

/* Given a goal and a current set of vals, evaluate all possible moves on vals and return the best new set */
function optimize1(goal, vals) {
    // Start with the current position
    var best_vals  = vals.map( Math.round );
    var best_score = score(goal, best_vals); 

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

/* optimizez: Run the count optimizer until the array is unchanged or we run out of steps 
 * @param goal - array of goal counts 
 * @param vals - array of initial values. If it is shorter than goal, it is extended with zeros. 
 */

MAX_STEPS=100000;
function optimize(goal, vals){
    p(goal,'<-',vals);
    vals = [...vals];           // make a local copy

    // Make sure both are the same length
    while (vals.length < goal.length) {
        vals.push(0);
    }

    // with a maximum of MAX_STEPS, iteratively optimize
    for (var i=0; i<MAX_STEPS ; i++) {
        nvals = optimize1(goal, vals);
        if (equal(vals,nvals)) {
            break;
        }
        vals = nvals;
    }
    p('   -> ', nvals);
    return nvals
}

/* pluck: Given an array, return an array of either the odds or the evens elements */
function pluck(src,offset) {
    var a = []
    for (var i=0; i< src.length; i+=2){
        a.push( src[i + offset]);
    }
    //p("--PLUCK--");
    //p("src:",src);
    //p("offset:",offset);
    //p("ret:",a);
    return a;
}

/* like the Python zip */
function zip(a,b) {
    var ret = [];
    for (var i = 0; i < a.length; i++) {
        ret.push(a[i]);
        ret.push(b[i]);
    }
    //p("---ZIP---")
    //p("a:",a);
    //p("b:",b);
    //p("ret:",ret);
    return ret;
}

/* zip_optimize: Like optimize above, but process the odd and even elements separately.
 * Odd elements represent male counts, even female counts. This assures that sex won't
 * be changed after the top-level optimization.
 */

function zip_optimize(goal, vals){
    var male_goal   = pluck(goal, 0);
    var female_goal = pluck(goal, 1);
    var male_vals   = pluck(vals, 0);
    var female_vals = pluck(vals, 1);

    var nmale   = optimize(male_goal, male_vals);
    var nfemale = optimize(female_goal, female_vals);
    return zip(nmale, nfemale);
}

function sum_up(vals) {
    var a = 0;
    var b = 0;
    for ( var i=0; i< vals.length; i+=2 ){
        a += vals[i];
        b += vals[i+1];
    }
    return [a,b]
}

// True measures
true_blocks = [1,2, 2,4, 5,10, 1000,1010, 1500,1060, 1800,1100];
true_map    = ['#b1m', '#b1f', '#b2m', '#b2f', '#b3m', '#b3f',
               '#b4m', '#b4f', '#b5m', '#b5f', '#b6m', '#b6f'];
true_county1 = sum_up(true_blocks.slice(0,6));
true_county2 = sum_up(true_blocks.slice(6,12));
true_state   = sum_up( concat(true_county1, true_county2) );

p("true_blocks:",true_blocks);
p("county1:", true_county1);
p("county2:", true_county2);
p("state:", true_state);

// privitized measurements
var epsilon = 0.25;
///////////////////////////////////////////////
//////////////// NOISE BARRIER ////////////////
///////////////////////////////////////////////
pm_blocks  = privitize_array(true_blocks, epsilon);
pm_county1 = privitize_array(true_county1, epsilon);
pm_county2 = privitize_array(true_county2, epsilon);
pm_state   = privitize_array(true_state, epsilon);
///////////////////////////////////////////////
//////////////// NOISE BARRIER ////////////////
///////////////////////////////////////////////

// Run top-level -> top-level to balance the histogram.
// This isn't needed with just one set of measurements, but
// we do it anyway because the real top-down algorithm does.
p_state = optimize(pm_state, pm_state);

p("\nStarting state: ", true_state);
p("Ending state: ", p_state);

// Distribute from the state to the two counties:
p_county12 = zip_optimize( concat(pm_county1,pm_county2), p_state);
p("p_county12:",p_county12);
p_county1  = p_county12.slice(0,2);
p_county2  = p_county12.slice(2,4);

// distribute from each county to the blocks
p_block123 = zip_optimize( pm_blocks.slice(0,6),  p_county1 );
p_block456 = zip_optimize( pm_blocks.slice(6,12), p_county2 );

p_blocks   = concat(p_block123, p_block456);
true_map    = ['#b1m', '#b1f', '#b2m', '#b2f', '#b3m', '#b3f',
               '#b4m', '#b4f', '#b5m', '#b5f', '#b6m', '#b6f'];

p("\nStarting blocks: ",true_blocks);
p("Ending blocks:   ",p_blocks);

total_error = 0;
for(var i=0;i< true_blocks.length; i++){
    p(true_blocks[i],"-->",p_blocks[i]);
    total_error += Math.abs( true_blocks[i] - p_blocks[i] );
}
p("\nTotal error:",total_error);

//goal = [1,2,3,4,5,6];
//v1 = [3,2,1,0,3,6];

//vn = optimize(goal, [99,0,0,0,0,0]);
//vn = optimize(goal, [0,0,10,0,0,0]);
//vn = optimize(goal, [0,0,0,0,0,10]);

//optimize1(goal, v1);
