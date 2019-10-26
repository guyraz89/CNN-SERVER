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
    console.log(firebase.database());
    
    
    $('#add_btn').click(() => {
        console.log(firebase)
        console.log($('.form-control').val())
        let timestamp = firebase.firestore.Timestamp.fromDate(new Date());
        let body = $('.form-control').val();
        console.log(timestamp);
        console.log(body);
    });
});

function writeNewMessage(dogBreed,uid, username, picture, title, body, timestamp) {
    // A post entry.
    var postData = {
      author: username,
      uid: uid,
      body: body,
      title: title,
      starCount: 0,
      authorPic: picture,
      timestamp: timestamp
    };
    // Get a key for a new Post.
  var newMessageKey = database.ref().child('dogBreed').child(dogBreed).child('messages').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/dogBreed/'+dogBreed+'/messages/' + newPostKey] = postData;

  return database.ref().update(updates);
}

function readMessages(dogBreed){
    database.ref().child('dogBreed').child(dogBreed).on('value',
        function(snapshot){
            snapshot.forEach(function(childSnapshot){
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
            });
        });
}


