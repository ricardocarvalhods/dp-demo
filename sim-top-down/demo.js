// All wrapped inside the document.ready() function so that it runs when the document is completely loaded
// We bind the 'input' event because it fires whenever the slider is moved. The 'changed' event only fires
// when the slider is released
console.log("foo");
$(document).ready(function() {
    console.log("ready");
    $("input").on('input', function() {
        console.log("Handler for .keypress() called." );
    });
});

console.log("bar");
