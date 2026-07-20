// Initialize Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Handle Email Subscription
document.getElementById('subscribeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('emailInput').value;

    db.collection('subscribers').add({
        email: email,
        subscribedAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        alert('Thank you for subscribing!');
        document.getElementById('emailInput').value = '';
    })
    .catch((error) => {
        console.error('Error saving email to Firebase: ', error);
        alert('Something went wrong. Please try again.');
    });
});
