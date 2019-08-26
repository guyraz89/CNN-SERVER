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

function register(){
    if (!firebase.apps.length) {
        firebase.initializeApp({});
     }
    console.log(firebase.auth);
    var userEmail = document.getElementById("email_field").value;
    var userPassword = document.getElementById("password_field").value;
    window.alert(userEmail+" "+userPassword);

    //Create User with Email and Password
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("Error: "+errorCode +" "+errorMessage);
        window.alert("Error: "+errorCode +" "+errorMessage);
    });
    window.alert("user are registerd");
    window.location.href="./loby.html";
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
    });
    window.alert("user are signed in");
    window.location.href="./loby.html";
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