# dp-demos
Differential Privacy Demos

This git repository is designed to be checked out in the root directory of a webserver directory.

A collection of scripts and web-based demos designed to help explain how differential privacy works.
Welcome to the web demo for differential privacy.

# Development Notes
## Requirements

Requirements for a differential privacy demo:

1. Must run in a browser. This means we have the following development options:
   * Some JavaScript-based framework.
   * processing.js
   * p5js.org
   * https://jqueryui.com/slider/#range

Demos:
  * https://www.openprocessing.org/sketch/115256

  * http://materializecss.com/
  * https://krescruz.github.io/angular-materialize/
  * http://foundation.zurb.com
  * http://foundation.zurb.com/sites/docs/slider.html
  * http://foundation.zurb.com/sites/docs/v/5.5.3/components/range_slider.html

2. Must show a simple query and how differential privacy generates results.

   - Show number of people on a block.
   - Click a button to compute again
   - Allow it to run over time and build up a distribution.

3. Must be mathematically correct.
So we need a laplace in JavaScript:
* https://www.npmjs.com/package/probability-distributions

4. Must use a responsive framework.

We decided to code this in small responsive framework, but we wanted slides are well.  So we tried to use a combination of a tiny responsible CSS style and a slider. We considered the following frameworks and sources:

* https://minicss.org/
* https://www.webpagefx.com/blog/web-design/small-css-frameworks/
* https://milligram.io/
* https://purecss.io/tools/
* http://getskeleton.com/

We decided to use the following tools with the following Google hosting service points. [Learn more about about Google Hosted Libraries](https://developers.google.com/speed/libraries/)

* (Skeleton 2.0.4)[http://getskeleton.com/]:

Skeleton is so small that we self-host it. Yea!


* (JQuery user interface version 1.12.1)[http://jqueryui.com/]: 

    <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>

* JQuery version 3:

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>

We have a demo at demo.html. Because JavaScript libraries need to be fetched by https://, rather than by file://, you can find a copy at https://demo.dpwiki.org/

##Graphing:

http://www.jscharts.com/how-to-use-line-graphs
https://plot.ly/javascript/
https://stackoverflow.com/questions/13300501/how-to-draw-a-plot-from-array-of-numbers-that-updates-every-sec-in-html-5
https://stackoverflow.com/questions/36113789/how-to-draw-a-line-graph-from-an-array-using-javascript
http://jsfiddle.net/3T6qc/
https://stackoverflow.com/questions/18294300/flot-bar-graph-align-bars-with-x-axis-labels
https://stackoverflow.com/questions/33629003/flotcharts-barchart-first-and-last-bar-cut-off
