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
                $('.row').append('<div class="column"> <div class="card"><h3>Card 1</h3><p>' + breeds[i] + '</p><p>Some text</p> </div></div>')        
            }
        },
        error: function(err) {
            console.log(err);
        }
    });
    return breeds;
}