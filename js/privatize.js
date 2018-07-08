/* ================================================================
 * privitize.js 
 * Work by: Simson Garfinkel (simson.l.garfinkel@census.gov)
 *          William Yates
 *          Dan Kifer
 *
 * ================================================================
 * Public Domain
 *
 * ================================================================ */


// https://stackoverflow.com/questions/15313418/what-is-assert-in-javascript
function assert(condition, message) {
    if (!condition) {
        message = message || "Assertion failed";
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message; // Fallback
    }
}


/* Return the geometric distribution for the number _p */
function geometric(_p) {
   var x    = 1;
   var sum  = parseFloat(_p);
   var prod = parseFloat(_p);
   var q    = 1.0 - parseFloat(_p);
   var u    = Math.random();
   
   while (sum < u) {
      prod *= q;
      sum  += prod;
      x++;
   }
   
   return x;
}

/* Return geometric noise for a specific budget and sensitivity */

function geometric_noise(_budget, _sensitivity) {
   e = parseFloat(_budget) / parseFloat(_sensitivity);
   p = 1.0 - Math.exp(-e);
   x = geometric(p) - 1;
   y = geometric(p) - 1;
   return (x - y);
}

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
   return mu - (b * sgn(U) * Math.log(1 - 2* Math.abs(U)));
}

/* Laplace noise for a specific privacy budget and sensitivity */
function laplace_noise(_budget, _sensitivity,  ) {
   return laplace(0.0, (_sensitivity / _budget));
}

/* Geometric perturbation for a specific budget and sensitivity. The results will be integers */
function geometric_perturb(_ans, _budget, _sensitivity) {   
   return (geometric_noise(_budget, _sensitivity) + _ans);
}

/* Laplace perturbation for a specific budget and sensitivity.  The results will be real numbers */
function laplace_perturb(_answer, _budget, _sensitivity) {
   return _answer + laplace_noise(_budget, _sensitivity);
}

/* The differential privacy engine for privitizing histograms.*/
function privitize_histogram(model) {
    totalCounts = model.counts.reduce((a, b) => a+b, 0)
    // PRIVACY BARRIER START
    // compute laplace noises
    model.noises = [...Array( model.counts.length).keys() ].map( a => geometric_noise( model.epsilon, 1 ))
    // compute the privitized values
    var i;
    model.noisy_counts = [];
    for( i=0; i< model.counts.length; i++){
        model.noisy_counts[i] = model.counts[i] + model.noises[i];
        console.log(i,model.noisy_counts[i],model.counts[i],model.noises[i])
    }
    // PRIVACY BARRIER END
    
    console.log("privitize_histogram:",model)
    // post-process: round all negative numbers up to zero.
    // If we have invariant_counts, then move all numbers up as long as any number is zero, and then randomly distribute the error.
    // Otherwise, just bring all the negative numbers up to zero.
    if (model.invariant_counts==0) {
        model.noisy_counts = model.noisy_counts.map( count => Math.min( count, 0) );
        return model.callback(model);
    }

    // Apply the invariants.
    alert("Invariants not implemented currently.")
}
