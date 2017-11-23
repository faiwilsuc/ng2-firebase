import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

import { User } from 'firebase/app';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private fireDatabase: AngularFireDatabase,
              private fireAuth: AngularFireAuth) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const authFetch = new Promise((resolve, reject) => {
        this.fireAuth.authState.take(1).subscribe(
          (fetchedAuth: User) => {
            resolve(fetchedAuth);
          }
        );
      }
    );

    const typeFetch = new Promise((resolve, reject) => {
        authFetch.then(
          (auth: User) => {
            if (auth) {
              this.getUserTypeRef(auth.uid).take(1).subscribe(
                (snapshot) => resolve({auth: auth, type: snapshot.child('type').val()})
              );
            } else {
              resolve({auth: null, type: null});
            }
          }
        );
      }
    );

    return typeFetch.then(
      ({auth, type}) => {
        if (route.url.toString() !== 'login') {
          console.log('AuthGuard:  In main route');
          if (auth) {
            console.log('AuthGuard: User logged in (UID: ' + auth.uid + ')');
            if (type === route.url.toString()) {
              console.log('On correct path');
              return true;
            } else {
              console.log('Wrong path, moving to specific path');
              this.router.navigate([type]);
              return false;
            }
          } else {
            console.log('AuthGuard: User logged out, moving to login');
            this.router.navigate(['/login']);
            return false;
          }
        } else if (route.url.toString() === 'login') {
          console.log('AuthGuard: In login route');
          if (auth) {
            console.log('AuthGuard: User logged in, moving to specific path');
            this.router.navigate([type]);
            return false;
          } else {
            console.log('AuthGuard: User logged out');
            return true;
          }
        }
      }
    );
  }

  getUserTypeRef(uid: string) {
    return this.fireDatabase.object('/users/' + uid, {preserveSnapshot: true});
  }
}
