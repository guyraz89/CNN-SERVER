$(function() {
    
    $('#spinner').hide();

    $("input[type=file]").on("change", function() {
        $("[for=file]").html(this.files[0].name);
        $("#image_view").attr("src", URL.createObjectURL(this.files[0]));
        $("#predicted").text('');
    });

    $('#upload-file-btn').click(function() {
        $('#container').show();
        $('#spinner').show();
        var form_data = new FormData($('#upload-file')[0]);
        $('image_view').attr('src', $('#upload-file')[0])
        $.ajax({
            type: 'POST',
            url: '/upload',
            data: form_data,
            contentType: false,
            datatype: false,
            processData: false
        }).done(function(response) {
            $('#spinner').hide();
            $('#predicted').text(response);
        }).fail(function(err){
            $('#spinner').hide();
            alert('error:' + err);
        });
    });
});

