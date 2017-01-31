import firebase from 'firebase'

var config = {
        apiKey: "AIzaSyAyvY9guDDtYdReCGBZtLiB-y61nzZb10k",
        authDomain: "myreactapp-6b2d8.firebaseapp.com",
        databaseURL: "https://myreactapp-6b2d8.firebaseio.com",
        storageBucket: "myreactapp-6b2d8.appspot.com",
        messagingSenderId: "808664201748"
};
firebase.initializeApp(config);

export const ref = firebase.database().ref()
export const firebaseAuth = firebase.auth