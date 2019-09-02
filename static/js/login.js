const firebaseConfig = {
    apiKey: "AIzaSyD06U44xlA6MvwM898APHhA7f1MK8zlKRQ",
    authDomain: "dogbreedclassifier-finalproj.firebaseapp.com",
    databaseURL: "https://dogbreedclassifier-finalproj.firebaseio.com",
    projectId: "dogbreedclassifier-finalproj",
    storageBucket: "",
    messagingSenderId: "855533767649",
    appId: "1:855533767649:web:ec47083ffed253e6"
};

firebase.initializeApp(firebaseConfig); // Was missing

function register() {
    if (!firebase.apps.length) {
        firebase.initializeApp({});
     }
    var userEmail = document.getElementById("email_field").value;
    var userPassword = document.getElementById("password_field").value;
    //Create User with Email and Password
    firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("Error: "+errorCode +" "+errorMessage);
        window.alert("Error: "+errorCode +" "+errorMessage);
    }).then(function() {
      firebase.auth().onAuthStateChanged(function(user) {
        console.log(user)
        if (user) {
          firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
            success(idToken);
          }).catch(function(error) {
            console.log(error);
          });
        }
      });
    });
}

function login(){
    if (!firebase.apps.length) {
        firebase.initializeApp({});
    }
    var userEmail = document.getElementById("email_field").value;
    var userPassword = document.getElementById("password_field").value;
    window.alert(userEmail + " " + userPassword);

    //Sign In User with Email and Password
    firebase.auth().signInWithEmailAndPassword(userEmail, userPassword).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        window.alert("Error: " + errorCode + " " +errorMessage);
    }).then(function() {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
            success(idToken);
          }).catch(function(error) {
            console.log(error);
          });
        }
      });
    });  
}

function success(userIdToken) {
  $.ajax({
    type: 'POST',
    url: '/index',
    headers: {
      'Authorization': userIdToken 
    },
    success: function(response) {
        window.location.href = '/index'
    },
    error: function(error){
      console.log(error);
    }
  });
}
