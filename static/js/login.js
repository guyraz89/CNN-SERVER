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
     console.log(userEmail);
     console.log(userPassword);
     
    //Create User with Email and Password
    firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("Error: "+errorCode +" "+errorMessage);
        window.alert("Error: "+errorCode +" "+errorMessage);
    });
}

// firebase.auth().onAuthStateChanged(function(user) {
//   console.log(user)
//   if (user) {
//     var userIdToken;
//     user.getToken().then(function(idToken) {
//       userIdToken = idToken;
//     });
//     success(userIdToken);
//   }
// });


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
        return;
    });
    window.location.href = "/index"
}

function logout(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          firebase.auth().signOut().then(function() {
            // Sign-out successful.
            window.alert('User Logged Out!');
          }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;

            window.alert("Error: "+errorCode +" "+errorMessage);
          });
        } else {
          // User is signed out.
          window.alert('User Already Logged Out!');
        }
      });
}

function success(userIdToken) {
  $.ajax({
    type: 'POST',
    url: '/index',
    headers: {
      'Authorization': userIdToken 
    },
    success: function(response){
      console.log(response)
      return response;
    },
    error: function(error){
      console.log(error);
    }
  });
}

function success2() {
  $.ajax({
    type: 'GET',
    url: '/index',
    success: function(response){
      console.log(response)
      return response;
    },
    error: function(error){
      console.log(error);
    }
  });
}