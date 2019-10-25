$(function() {
    loadCards();    
    
});

function loadCards() {
    var breeds = null;
    $.ajax({
        type: 'POST',
        url: '/breeds',
        success: function(response) {
            breeds = JSON.parse(response).sort();
            for (let i = 0; i < breeds.length; i++) {
                //$('.row').append('<div class="column"> <div class="card"><h3>Card 1</h3><p>' + breeds[i] + '</p><p>Some text</p> </div></div>')        
                $('.posts-container').append('<a href='+ toTitleCase(breeds[i]) + '><div class="single-post-container"><div class="dog-image"><img src="../static/images/dog.png" class="rounded-circle" alt="Cinque Terre"></div><div class="dog-name"><h1>' + toTitleCase(breeds[i]) + '</h1></div></div></a>')
            // TODO: 1. replace the current cards with the new one
            //       2. add photes of dogs
            }
        },
        error: function(err) {
            console.log(err);
        }
    });
    return breeds;
}

function toTitleCase(text) {
    text = text.toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');
    return text;
}