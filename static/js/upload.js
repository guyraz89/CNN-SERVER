$(function() {
    $('#upload-file-btn').click(function() {
        var form_data = new FormData($('#upload-file')[0]);        
        $.ajax({
            type: 'POST',
            url: '/upload',
            data: form_data,
            contentType: false,
            datatype: false,
            processData: false
        }).done(function(response) {
            $('#predicted').html(response);
        }).fail(function(err){
            console.log('fail')
            alert('error:' + err);
        });
    });
});

