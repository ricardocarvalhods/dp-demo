apt_residents = [];

icons = [
    {//woman
        'html': [ '👩🏻', '👩🏼', '👩🏽', '👩🏾', '👩🏿' ],
        'men': 0,
        'women': 1,
        'age': 25
    }, 
    {//man
        'html': [ '👨🏻', '👨🏼', '👨🏽', '👨🏾', '👨🏿' ],
        'men': 1,
        'women': 0,
        'age': 55
    }, 
    {//man and woman
        'html': [ '&#x1F46B;' ],
        'men': 1,
        'women': 1,
        'age': 33
    }, 
    {//family
        'html': [ '&#x1F46A;' ],
        'men': 2,
        'women': 1,
        'age': 30
    }, 
]


// Utility functions
function getArrayRandomElement (arr) {
    if (arr && arr.length) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
    // The undefined will be returned if the empty array was passed
}

// Repeat a string, substituting %i for the counter
function repeat(s, start, end) {
    ret = []
    for (var i = start; i < end; i++) {
        ret.push(s.replace("%i", i))
    }
    return ret.join("");
}

function draw_houses(count) {
    $('#houses').html('<div id="house1" class="house">' + '<div id="apartment" style="padding-top:10pt; font-size:20pt"></div>' + '</div>');
}

function draw_windows(count) {
    $('#apartment').html(repeat(
        '<div class="windowHolder" id="wh%i"></div>', 0, 4));
    for (index = 0, i = 0; i < 4; i++) {
        $('#wh' + i).html(repeat('<div class="window" id="w%i"/><div class="windowSpacer" id="wsp%i"/>', index, index + 4))
        index += 4;
    }
}

function set_people_count(count) {
    apt_residents = []
    people = Math.round(count / 10 * 16); //fraction of the slider * window number
    for (i = 0; i < 16; i++) {
        html = '';
        if (i < people) {
            person = getArrayRandomElement(icons)
            apt_residents.push(person);
            emojis = person['html'];
            html   = getArrayRandomElement(emojis)
        }
        if (!(html == undefined)) {
            html = "<span class='emoji'>" + html + "</span>";
        }
        $('#w' + i).html(html);
    }
    update_values()
}

//Updates the metrics at the top given the number of people set by the slider
//Is called every time the people slider is touched
function update_values() {
    //update counts using people dictionary
    metrics = {
        'men': 0,
        'women': 0,
        'age': 0
    };
    for (i = 0; i < apt_residents.length; i++) {
        elem = apt_residents[i];
        metrics['men'] += elem['men'];
        metrics['age'] += elem['age'];
        metrics['women'] += elem['women'];
    }
    metrics['age'] /= apt_residents.length;
    metrics['age'] = Math.round(metrics['age'] * 10) / 10;
    //update html elements
    $('#trueAvgAge').html('' + metrics['age']);
    $('#trueCountF').html('' + metrics['women']);
    $('#trueCountM').html('' + metrics['men']);
}

// given the current model, update the accuracy cell in the view.
//Accuracy is caluclated by averaging the fraction difference
//the noisy value is away from the true value
function update_accuracy(model) {
    trueVals = model.counts;
    repVals = model.noisy_counts;
    accuracy = 0
    for (i = 0; i < trueVals.length; i++) {
        accuracy += 1 - Math.abs(repVals[i] - trueVals[i]) / trueVals[i];
    }
    console.log('accuracy ' + accuracy);
    accuracy /= trueVals.length;
    accuracy *= 100;
    console.log('accuracy ' + accuracy);
    $('#accuracy').html(Math.round(accuracy * 10) / 10 + "%");
}


// update is called by the engine after a differential privacy operation is done.
// We update the screen and recalculate the accuracy
var update = function(model) {
    var i;
    for (i = 0; i < model.counts.length; i++) {
        $('#reported' + model.labels[i]).html(model.noisy_counts[i]);
    }
    update_accuracy(model);
}

function blank_reported_results() {
    console.log('blank');
    $('.reported').html('');
    $('#reportedAvgAge').html('');
    $('#reportedCountF').html('');
    $('#reportedCountM').html('');
}


function roll_dp(event) {
    epsilon_slider_value = $('#epsilonSlider').val() / 50;
    // Create the differential privacy object
    model = {
        epsilon: epsilon_slider_value,
        callback: update,
        counts: [],
        labels: ['CountM', 'CountF', 'AvgAge'],
        invariant_counts: 1
    };
    // Now get the counts from the HTML form
    var i;
    for (i = 0; i < model.labels.length; i++) {
        model.counts[i] = parseFloat($('#true' + model.labels[i]).html());
    }
    privatize_histogram(model);
}

// Set the number of people the apartment
function popSlider_moves(event) {
    var popSlider = $('#popSlider').val();
    count = popSlider;
    set_people_count(count);
    blank_reported_results();
}

//Update metric for epsilon value
function epsilon_moves(event) {
    var epsilon = $('#epsilonSlider').val() / 50;
    if (epsilon<.05) epsilon=.05;
    $('#epsilonTable').html(epsilon);
    blank_reported_results();
}

// All wrapped inside the document.ready() function so that it runs when the document is completely loaded
// We bind the 'input' event because it fires whenever the slider is moved. The 'changed' event only fires
// when the slider is released
$(document).ready(function() {
    draw_houses(1);
    draw_windows(4);
    blank_reported_results();
    $('#popSlider').val(0);
    $('#popSlider').on('input', popSlider_moves);
    $('#epsilonSlider').on('input', epsilon_moves);
    $('#rollButton').on('click', roll_dp);
});
