// Your Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();


// Function to handle user login
function login() {
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
      alert("Error: " + errorMessage);
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
    console.error("Error getting document:", error);
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
      alert("Error: " + errorMessage);
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
    alert("Error: " + error.message);
  });
}

// Attach functions to window object
window.login = login;
window.signUp = signUp;
window.logout = logout;
window.getUserPoints = getUserPoints;



