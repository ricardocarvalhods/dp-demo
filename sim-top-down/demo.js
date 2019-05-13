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
    $("#rb1").text( $("#rb1f").nval() + $("#rb1m").nval());
    $("#rb2").text( $("#rb2f").nval() + $("#rb2m").nval());
    $("#rb3").text( $("#rb3f").nval() + $("#rb3m").nval());
    $("#rb4").text( $("#rb4f").nval() + $("#rb4m").nval());
    $("#rb5").text( $("#rb5f").nval() + $("#rb5m").nval());
    $("#rb6").text( $("#rb6f").nval() + $("#rb6m").nval());

    // Calc Farmland totals
    $("#rfcounty").text(  $("#rb1").nval()  + $("#rb2").nval()  + $("#rb3").nval());
    $("#rfcountyf").text( $("#rb1f").nval() + $("#rb2f").nval() + $("#rb3f").nval());
    $("#rfcountym").text( $("#rb1m").nval() + $("#rb2m").nval() + $("#rb3m").nval());

    // Calc Urbanville totals
    $("#rucounty").text(  $("#rb4").nval()  + $("#rb5").nval()  + $("#rb6").nval());
    $("#rucountyf").text( $("#rb4f").nval() + $("#rb5f").nval() + $("#rb6f").nval());
    $("#rucountym").text( $("#rb4m").nval() + $("#rb5m").nval() + $("#rb6m").nval());

    // Calc State totals
    $("#rstate").text(   $("#rfcounty").nval() + $("#rucounty").nval() );
    $("#rstatef").text(  $("#rfcountyf").nval() + $("#rucountyf").nval() );
    $("#rstatem").text(  $("#rfcountym").nval() + $("#rucountym").nval() );

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


