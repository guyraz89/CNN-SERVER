$(function() {
    const firebaseConfig = {
        apiKey: "AIzaSyD06U44xlA6MvwM898APHhA7f1MK8zlKRQ",
        authDomain: "dogbreedclassifier-finalproj.firebaseapp.com",
        databaseURL: "https://dogbreedclassifier-finalproj.firebaseio.com",
        projectId: "dogbreedclassifier-finalproj",
        storageBucket: "",
        messagingSenderId: "855533767649",
        appId: "1:855533767649:web:ec47083ffed253e6"
    };
    
    firebase.initializeApp(firebaseConfig);

    $('#input_pic').on('change', () => {
        console.log();
        let pic = $('#input_pic')[0].files[0]; 
        $("#image_view").attr("src", URL.createObjectURL(pic));
        $("#result").text('?');
        $("#image_view").css({"border-width":"0px"});
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

    $("#logout_link").click(() => {
        console.log(firebase.auth)
        var user = firebase.auth().currentUser
        console.log(user)
        if (user) {
            // User is signed in.
            firebase.auth().signOut().then(function() {
            // Sign-out successful.
            window.alert('User Logged Out!');
            window.location.href = "/logout"
            }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;

            window.alert("Error: " + errorCode + " " + errorMessage);
            });
        } else{
            window.alert("user already logged out !!!!");
        }
    });
});