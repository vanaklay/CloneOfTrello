import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() { }

  signUpUser(email: string, password: string) {
    return new Promise(
      (resolve, reject) => {
          firebase.auth().createUserWithEmailAndPassword(email, password).then(
            () => {
              resolve();
            }
          ).catch((error) => {
            reject(error);
          })
        }
    );
  }

  signInUser(email: string, password: string) {
    return new Promise(
      (resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(email, password).then(
          (data) => {
            console.log('Connected');
            resolve(data);
          }
        ).catch((error) => {
          reject(error);
        })
      }
    )
  }

  signOutUser(){
    firebase.auth().signOut();
  }
}
