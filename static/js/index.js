$(function() {

    $('#input_pic').on('change', () => {
        console.log();
        let pic = $('#input_pic')[0].files[0]; 
        $("#image_view").attr("src", URL.createObjectURL(pic));
        $("#predicted").text('');
    });

    $('#upload-file-btn').click(() => {
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
            $("#image_view").css({
                "border-color": "#8A2BE2", 
                "border-width":"2px", 
                "border-style":"solid"});
            $('#result').text(response);
        }).fail(function(err){
            alert('error:' + err);
        });
    });

    $("#forum_link").click(() => {
        $.ajax({
            type: 'GET',
			url: '/forum',
			success: function(response){
              console.log(window.location);
			},
			error: function(error){
				console.log(error);
			}
		});
    });

});