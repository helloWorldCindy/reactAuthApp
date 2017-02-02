import { ref, firebaseAuth } from '../config/constants'
import firebase from 'firebase'

export function auth (email, pw, name) {
  return firebaseAuth().createUserWithEmailAndPassword(email, pw)
    .then((user)=>{
    ref.child(`users/${user.uid}/info`).set({
      email: user.email,
      name: name,
      uid: user.uid
    });
  })
    .catch((error) => console.log('Oops', error))
}

export function logout () {
  return firebaseAuth().signOut()
}

export function login (email, pw) {
  return firebaseAuth().signInWithEmailAndPassword(email, pw).catch((error) => {
      alert(error.message);
  })
}

export function signInGoogle () {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebaseAuth().signInWithPopup(provider).then((result) => {
    var user = result.user;
    ref.child(`users/${user.uid}/info`).set({
      email: user.email,
      name: user.email,
      uid: user.uid
    });
  }).catch(function(error) {
    console.log(error.message)
  });
}

export function signInFacebook () {
  var provider = new firebase.auth.FacebookAuthProvider();
  firebaseAuth().signInWithPopup(provider).then((result) => {
    var user = result.user;
    console.log(user.displayName)
    ref.child(`users/${user.uid}/info`).set({
      email: "",
      name: user.displayName,
      uid: user.uid
    });
  }).catch(function(error) {
    console.log(error.message)
  });
}