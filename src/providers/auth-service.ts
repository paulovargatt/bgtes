import { Injectable, Inject } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase';

import "rxjs/add/operator/filter";
import "rxjs/add/operator/first";
import { Facebook } from '@ionic-native/facebook';
import { Platform, AlertController } from 'ionic-angular';


@Injectable()
export class AuthService {
  public authState: AngularFireAuth;
uid:any;
  constructor(public alertCtrl: AlertController,public af: AngularFireDatabase, public afAuth: AngularFireAuth,@Inject(FirebaseApp) public fire: any
  ,public platform:Platform,public fb:Facebook
   ) 
   {
 afAuth.authState.subscribe((user: firebase.User) => {
      if (!user) {
        this.uid = null;
        return;
      }
      this.uid = user.uid;      
    });

  }




  

   signInWithFacebook(){
    if (this.platform.is('cordova')) {
        return this.fb.login(['email']).then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
         return firebase.auth().signInWithCredential(facebookCredential).then(res => {

                   this.af.object('/users/'+this.uid).subscribe(res1 => {
                     if(res1.role>-1){}
                      else{
                                   this.af.object('/users/'+this.uid+'/role').set(0);
                      }
                   })
      })
      })
      .catch((error) => {
throw error
      })
      
    } else {
      return this.afAuth.auth
        .signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(res => {
                   this.af.object('/users/'+this.uid).subscribe(res => {
                     if(res.role>-1){}
                      else{
                                   this.af.object('/users/'+this.uid+'/role').set(0);
                      }
                   })
      })
    }

  }











  signInWithGoogle(): firebase.Promise<AngularFireAuth> {
    

      return this.afAuth.auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then(res => {
                   this.af.object('/users/'+this.uid).subscribe(res => {
                    if(res.role>-1){}
                      else{
                                   this.af.object('/users/'+this.uid+'/role').set(0);
                      }
                   })
      })
  }

  registerUser(email,password,password2): firebase.Promise<AngularFireAuth> {
    
  return this.afAuth.auth.createUserWithEmailAndPassword(
    email,
   password
  )
  .then((res: AngularFireAuth) => {
    this.af.object('/users/'+this.uid).subscribe(res => {
                     if(res.role>-1){}
                      else{
                                   this.af.object('/users/'+this.uid+'/role').set(0);
                      }
                   })

    return res;

  })
  .catch((error) => {
    throw error;
    });



}

  signIn(email,password): firebase.Promise<AngularFireAuth> {
    return this.afAuth.auth.signInWithEmailAndPassword(
       email,
      password
    ).then(res => {
                   this.af.object('/users/'+this.uid).subscribe(res => {
                     if(res.role>-1){}
                      else{
                                   this.af.object('/users/'+this.uid+'/role').set(0);
                      }
                   })
      })
      .catch((error) => {
    throw error;

    });
  }

  signOut(): void {
firebase.auth().signOut();
    
  }

  forgotPassword(email): firebase.Promise<AngularFireAuth> {
    return firebase.app().auth().sendPasswordResetEmail(email)
    .then( (s) => {
      
      let alert = this.alertCtrl.create({
    title: 'Password Reset',
    subTitle: 'Check your inbox to reset your password',
    buttons: ['Dismiss']
  });
  alert.present();


    })
    .catch( (error) => {
      throw error
    })

    
  }


}