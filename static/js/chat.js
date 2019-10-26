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
    database.ref('dogbreed').on('value', gotData, gotError);

    function gotData(data){
        console.log(data);
        var messages = data.val();
        var keys = Object.keys(messages);
        console.log(keys);
    }

    function gotError(error){
        console.log(error);
    }

    $('#add_btn').click(() => {
        let url = window.location.href;
        urlArr = url.split('/');
        let dogbreed = urlArr[urlArr.length-1];
        let body = $('#chat_input').val();
        let user = firebase.auth().currentUser;
        if (user) {
            var name = user.displayName;
            var uid = user.uid;
        }
        console.log('dogbreed: '+dogbreed+'\nuid: '+uid+'\nname: '+name+'\nbody: '+body);
        writeNewMessage(dogbreed,uid,name,body);
    });

    function writeNewMessage(dogBreed,uid, username, body) {
        console.log(database);
        // A post entry.
        var postData = {
          author: username,
          uid: uid,
          body: body,
        };
        // Get a key for a new Post.
      var newMessageKey = database.ref().child('dogBreed').child(dogBreed).child('messages').push().key;
    
      // Write the new post's data simultaneously in the posts list and the user's post list.
      var updates = {};
      updates['/dogBreed/'+dogBreed+'/messages/' + newMessageKey] = postData;
    
      return database.ref().update(updates);
    }
});

function readMessages(dogBreed){
    database.ref().child('dogBreed').child(dogBreed).on('value',
        function(snapshot){
            snapshot.forEach(function(childSnapshot){
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
            });
        });
}


