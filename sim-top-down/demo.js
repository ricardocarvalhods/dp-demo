// All wrapped inside the document.ready() function so that it runs when the document is completely loaded
// We bind the 'input' event because it fires whenever the slider is moved. The 'changed' event only fires
// when the slider is released

// Create a jquery plugin to use .nval() to get the numeric val
// https://stackoverflow.com/questions/9227268/how-can-val-return-number
$.fn.nval = function() {
    // handle the spans
    if (this.text().length){
        return Number(this.text());
    }
    // handle the inputs
    if (this.val().length){
        return Number(this.val());
    }
    return 0;
};


function recalc() {
    // Calc the block totals
    $("#rb1-pop").text( $("#rb1-f").nval() + $("#rb1-m").nval());
    $("#rb2-pop").text( $("#rb2-f").nval() + $("#rb2-m").nval());
    $("#rb3-pop").text( $("#rb3-f").nval() + $("#rb3-m").nval());
    $("#rb4-pop").text( $("#rb4-f").nval() + $("#rb4-m").nval());
    $("#rb5-pop").text( $("#rb5-f").nval() + $("#rb5-m").nval());
    $("#rb6-pop").text( $("#rb6-f").nval() + $("#rb6-m").nval());

    // Calc Ruralland totals
    $("#rrcounty-pop").text( $("#rb1-pop").nval()  + $("#rb2-pop").nval()  + $("#rb3-pop").nval());
    $("#rrcounty-f").text(   $("#rb1-f").nval() + $("#rb2-f").nval() + $("#rb3-f").nval());
    $("#rrcounty-m").text(   $("#rb1-m").nval() + $("#rb2-m").nval() + $("#rb3-m").nval());

    // Calc Urbanville totals
    $("#rucounty-pop").text( $("#rb4-pop").nval()  + $("#rb5-pop").nval()  + $("#rb6-pop").nval());
    $("#rucounty-f").text(   $("#rb4-f").nval() + $("#rb5-f").nval() + $("#rb6-f").nval());
    $("#rucounty-m").text(   $("#rb4-m").nval() + $("#rb5-m").nval() + $("#rb6-m").nval());

    // Calc State totals
    $("#rstate-pop").text( $("#rrcounty-pop").nval() + $("#rucounty-pop").nval() );
    $("#rstate-f").text(  $("#rrcounty-f").nval()   + $("#rucounty-f").nval() );
    $("#rstate-m").text(  $("#rrcounty-m").nval()   + $("#rucounty-m").nval() );

}

$(document).ready(function() {
    $("input").on('input', function() {
        this.value = this.value.replace(/\D/g,'');
        if (this.value.length > 4){
            this.value='9999';
        }
        recalc();
    });
    recalc();
});


