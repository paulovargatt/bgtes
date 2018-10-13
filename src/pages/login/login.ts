import { Component } from '@angular/core';
import { NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

import {TabsPage} from '../tabs/tabs'

import { AuthService } from '../../providers/auth-service';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase'
import { Storage } from '@ionic/storage';
import { Keyboard } from '@ionic-native/keyboard';


//By Rekar Dilzar Rashid Botany +9647504051800
import { BackgroundMode } from '@ionic-native/background-mode';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login {
loginData:any;
registerData:any;
registerPage: boolean=false;
fb:boolean=false;

  constructor(public alertCtrl: AlertController,public kb: Keyboard,public bg:BackgroundMode,public storage: Storage ,public navCtrl: NavController, public navParams: NavParams,af: AngularFireDatabase,private afService: AuthService,
  platform: Platform, splashScreen: SplashScreen) {



this.kb.onKeyboardShow().subscribe(data => {
       this.fb=true;
    });

    this.kb.onKeyboardHide().subscribe(data => {
       this.fb=false;
    });


        platform.ready().then(() => {


            
       platform.registerBackButtonAction(() => {
            if(this.navCtrl.canGoBack()){
              this.navCtrl.pop();
            }
           else{
              this.bg.moveToBackground();
            }
          });
   


if (splashScreen) {
setTimeout(() => {
splashScreen.hide();
}, 500);
  }
        });
          

           this.afService.afAuth.authState.subscribe((user: firebase.User) => {
      if (!user) {

      }
      else{
            this.navCtrl.setRoot(TabsPage);

      }

    });

          
         

          this.loginData={email:"admin@example.com",password:"password"};
          this.registerData={email:"",password:"",password2:""};
            
/*
 storage.get('email').then((val) => {
         this.loginData.email=val;
       })
        storage.get('password').then((val) => {
         this.loginData.password=val;
       })
          */
  }

  page(){
    this.registerPage = !this.registerPage;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Login');
  }


signInWithFacebook(): void {
    this.afService.signInWithFacebook()
      .then(() => this.onSignInSuccess())
      .catch(error => {
             let alert = this.alertCtrl.create({
    title: 'Facebook Login',
    subTitle: 'Your Facebook doesn\'t contain email address',
    buttons: ['Dismiss'],
    
  });
  alert.present();
      })
  }

  signInWithGoogle(): void{
    this.afService.signInWithGoogle()
    .then(()=> this.onSignInSuccess());
  }

  signIn(): void {
    this.afService.signIn(this.loginData.email,this.loginData.password)
      .then(x => {
          this.storage.set('email', this.loginData.email);
          this.storage.set('password', this.loginData.password);

      })
      .catch((error) => {
    console.log(error);
             let alert = this.alertCtrl.create({
    title: 'Login',
    subTitle: 'Email Address or Password Incorrect',
    buttons: ['Dismiss']
  });
  alert.present();
    
    });
  }

  register(): void {
 
    this.afService.registerUser(this.registerData.email, this.registerData.password, this.registerData.password2)
    .then(x => {
          this.storage.set('email', this.registerData.email);
          this.storage.set('password', this.registerData.password);

      })
  .catch((error) => {

             let alert = this.alertCtrl.create({
    title: 'Login',
    subTitle: 'Email Address is not valid or already in use',
    buttons: ['Dismiss']
  });
  alert.present();
    
      });
 }
 
 forgotPassword(): void {
   this.afService.forgotPassword(this.loginData.email)
   .catch( (error) => {
                  let alert = this.alertCtrl.create({
    title: 'Password Reset',
    subTitle: error.message,
    buttons: ['Dismiss']
  });
  alert.present();
    })
 }

  private onSignInSuccess(): void {
//this.navCtrl.setRoot(TabsPage);
  }
  


}
