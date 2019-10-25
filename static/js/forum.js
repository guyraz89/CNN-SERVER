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
                $('.posts-container').append('<a href='+ breeds[i] + '><div class="single-post-container"><div class="dog-image"><img src="../static/images/dog.png" class="rounded-circle" alt="Cinque Terre"></div><div class="dog-name"><h1>' + breeds[i] + '</h1></div></div></a>')
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