


const firebaseConfig = {
  apiKey: "AIzaSyD5aNIXc9uE6Wq5LxKMr93v-L9rknFYhNg",
  authDomain: "lilypaddy-rewards.firebaseapp.com",
  projectId: "lilypaddy-rewards",
  storageBucket: "lilypaddy-rewards.appspot.com",
  messagingSenderId: "310967861663",
  appId: "1:310967861663:web:13b7385d186fcfd8513daa",
  measurementId: "G-T4D1E1Z39F"
};
console.log(firebaseConfig)
// Initialize Firebase
console.log("Before Init")
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
console.log("After Init")

// Function to handle user login
function login() {
  console.log("login")
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  if (document.getElementById("email").value === "" || document.getElementById("password").value === "") {
    alert("Please fill out the email and the password!")
    return;
  }
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      document.getElementById("login-form").style.display = "none";
      document.getElementById("logout-form").style.display = "block";
      document.getElementById("data").style.display = "block";
      localStorage.setItem('status', true);
      alert("Login successful");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Error: Invalid Credentials");
    });
}
function getCurrentUserId() {
  const user = auth.currentUser;
  if (user) {
    return user.uid;
  } else {
    alert("No user is currently signed in.");
    return null;
  }
}
function getUserPoints() {
  userId = getCurrentUserId()
  db.collection("users").doc(userId).get().then((doc) => {
    if (doc.exists) {
      const userData = doc.data();
      console.log(userData.points)
      document.getElementById("user-points").innerText = "Points: " + userData.points;
      console.log("User points:", userData.points);
    } else {
      console.log("No such document!");
    }
  }).catch((error) => {
    alert("Error: Please try again later, if this error persists, please contact the owner");
  });
}
// Function to handle user signup
function signUp() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  if (document.getElementById("name").value === "" || document.getElementById("email").value === "" || document.getElementById("password").value === "") {
    alert("Please fill out all fields!")
    return;
  }
  alert("By Pressing OK, you are to be informed that this web will not be responsible for any loss of points or any other damages that may occur, including data leaks. If you do not agree, please leave immediately. ")
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;

      // Add user data to Firestore
      return db.collection("users").doc(user.uid).set({
        email: email,
        name: document.getElementById("name").value, // You can add a name input field and get the value here
        userId: user.uid,
        points: 0
      }).then(() => {
        document.getElementById("login-form").style.display = "none";
        document.getElementById("logout-form").style.display = "block";
        document.getElementById("data").style.display = "block";
        alert("Sign Up successful");
        localStorage.setItem('status', true);
      });

    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Error: Please try again later, if this error persists, please contact the owner");
    });
}

// Function to handle user logout
function logout() {
  auth.signOut().then(() => {
    document.getElementById("login-form").style.display = "block";
    document.getElementById("logout-form").style.display = "none";
    alert("Logout successful");
    document.getElementById("data").style.display = "none";
    localStorage.setItem('status', false);
  }).catch((error) => {
    alert("Error: Please try again later, if this error persists, please contact the owner");
  });
}

// Attach functions to window object
window.login = login;
window.signUp = signUp;
window.logout = logout;
window.getUserPoints = getUserPoints;



