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

