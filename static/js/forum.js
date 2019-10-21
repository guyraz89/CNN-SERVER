$(function() {
    loadCards();    
    
});

function loadCards() {
    var breeds = null;
    $.ajax({
        type: 'POST',
        url: '/breeds',
        success: function(response) {
            breeds = JSON.parse(response);
            for (let i = 0; i < breeds.length; i++) {
                //$('.row').append('<div class="column"> <div class="card"><h3>Card 1</h3><p>' + breeds[i] + '</p><p>Some text</p> </div></div>')        
                $('.row').append('<div class="card"><img src="../images/avatar.png" alt="Avatar"><div class="container"><h4><b>' + breeds[i] + '</b></h4></div> </div>')
            // TODO: 1. replace the current cards with the new one
            //       2. add photes of dogs
            }
        },
        error: function(err) {
            console.log(err);
        }
    });
    console.log(breeds[1]);
    return breeds;
}