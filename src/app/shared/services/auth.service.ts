import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';

import * as firebase from 'firebase/app';
import { User } from 'firebase/app';

import { environment } from '../../../environments/environment';

@Injectable()
export class AuthService {

  private fireUserCreation;

  constructor(private router: Router, private fireAuth: AngularFireAuth, private fireDatabase: AngularFireDatabase) {
    this.fireUserCreation = firebase.initializeApp(environment.firebase, 'userCreationInstance');
  }

  static generatePassword(): string {
    let generatedPassword = '';
    const possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 16; i++) {
      generatedPassword += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
    }
    return generatedPassword;
  }

  registerUser(user: any, type: string): Promise<any> {
    const password = AuthService.generatePassword();
    return new Promise((resolve, reject) => {
        this.fireUserCreation.auth().createUserWithEmailAndPassword(user.email, password)
          .then(
            result => {
              this.onCreateUser(result.uid, result.email, type);
              const loginInfo = 'Created user and database entry with email: ' + user.email + ' and password: ' + password;
              resolve({result: result, loginInfo: loginInfo});
            }
          )
          .catch(
            error => {
              console.log(error);
              // reject(error);
            }
          );
      }
    );
  }

  onCreateUser(uid: string, email: string, type: string) {
    const userObservable = this.fireDatabase.object('/users/' + uid);
    userObservable.set({
      email: email,
      type: type
    });
  }

  login(email: string, password: string): void {
    this.fireAuth.auth.signInWithEmailAndPassword(email, password)
      .then(
        (user: User) => {
          console.log('User logged in (UID: ' + user.uid + ')');

          this.getUserTypeRef(user.uid).take(1).subscribe(
            (snapshot) => this.router.navigate([snapshot.child('type').val()])
          );
        }
      )
      .catch(
        error => console.log(error)
      );
  }

  getUserTypeRef(uid: string): FirebaseObjectObservable<any> {
    return this.fireDatabase.object('/users/' + uid, { preserveSnapshot: true });
  }

  getUserUid(): string {
    return this.fireAuth.auth.currentUser.uid;
  }

  getUserEmail(): string {
    return this.fireAuth.auth.currentUser.email;
  }

  getUserName(): string {
    return null;
  }

  logout(): void {
    this.fireAuth.auth.signOut();
    this.router.navigate(['/']);
  }

}
