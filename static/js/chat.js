$(function(){

    const fbg = {
        apiKey: "AIzaSyD06U44xlA6MvwM898APHhA7f1MK8zlKRQ",
        authDomain: "dogbreedclassifier-finalproj.firebaseapp.com",
        databaseURL: "https://dogbreedclassifier-finalproj.firebaseio.com",
        projectId: "dogbreedclassifier-finalproj",
        storageBucket: "",
        messagingSenderId: "855533767649",
        appId: "1:855533767649:web:ec47083ffed253e6"
    };
    
    firebase.initializeApp(fbg);
    var database = firebase.database();

    let url = window.location.href;
    urlArr = url.split('/');
    let dogbreed = urlArr[urlArr.length-1];

    $('#chat_name').text(toTitleCase(dogbreed) + ' Chat');

    var dogRef = database.ref().child('dogBreed/').child(dogbreed).child('/messages');
    dogRef.on('value', gotData, gotError);

    function gotData(data){
        $('#chat_body').html('');
        var messages = data.val();
        var keys = Object.keys(messages);
        var myUid = firebase.auth().currentUser.uid;
        for( var i=0; i < keys.length; i++){
            var k = keys[i];
            if(myUid == messages[k].uid){
                console.log('my '+messages[k].time);
                localMessage("../static/images/avatar.png", messages[k].body, messages[k].time);
            }else{
                console.log('Not my '+messages[k].time);
                externalMessage("../static/images/avatar.png", messages[k].body, messages[k].time);
            }
        }
    }

    function gotError(error){
        console.log(error);
    }

    $('#add_btn').click(() => {
        let body = $('#chat_input').val();
        var user = firebase.auth().currentUser;
        if (user) {
            var name = user.displayName;
            var uid = user.uid;
        }
        var d = new Date().toDateString();
        writeNewMessage(dogbreed,uid,body,d);
        $('#chat_input').val('');
    });

    function writeNewMessage(dogBreed,uid, body, date) {
        // A post entry.
        var postData = {
          uid: uid,
          body: body,
          time: date
        };
        // Get a key for a new Post.
      var newMessageKey = database.ref().child('dogBreed').child(dogBreed).child('messages').push().key;
    
      // Write the new post's data simultaneously in the posts list and the user's post list.
      var updates = {};
      updates['/dogBreed/'+dogBreed+'/messages/' + newMessageKey] = postData;
    
      return database.ref().update(updates);
    }
});

function localMessage(imgSrc, msg, timestamp) {
    $('#chat_body').append('<div class="d-flex justify-content-start mb-4"> <div class="img_cont_msg"> <img src="' + imgSrc + '" class="rounded-circle user_img_msg"></div><div class="msg_cotainer">' + msg + '<span class="msg_time">' + timestamp + '</span></div></div>');
}

function externalMessage(imgSrc, msg, timestamp) {
    $('#chat_body').append('<div class="d-flex justify-content-end mb-4"> <div class="img_cont_msg"> <img src="' + imgSrc + '" class="rounded-circle user_img_msg"></div><div class="msg_cotainer">' + msg + '<span class="msg_time">' + timestamp + '</span></div></div>');
}

function toTitleCase(text) {
    text = text.toLowerCase()
        .split('_')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');
    return text;
}

