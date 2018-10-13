import {Component, ViewChild} from '@angular/core';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Platform} from 'ionic-angular';
import {Storage} from '@ionic/storage';

import {TabsPage} from '../pages/tabs/tabs';
import {Login} from '../pages/login/login';
import {AuthService} from '../providers/auth-service';
import {TranslateService} from '@ngx-translate/core';
import {BackgroundMode} from '@ionic-native/background-mode';
//By Rekar Dilzar Rashid Botany +9647504051800
declare var FCMPlugin;
import * as firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any;
  public isLoggedIn: boolean;

  constructor(public storage: Storage, public bg: BackgroundMode, public translate: TranslateService, public afService: AuthService, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,) {
    translate.setDefaultLang('en');

    storage.get('lang').then((val) => {
      if (val != null) {
        translate.setDefaultLang(val);
      }
      else {
        translate.setDefaultLang('en');

      }
    })

    this.afService.afAuth.authState.subscribe((user: firebase.User) => {
      if (!user) {
        this.isLoggedIn = false;
        this.rootPage = Login;
      }
      else {

        this.isLoggedIn = true;
        this.rootPage = TabsPage;
      }

    });


    this.platform.ready().then(() => {
      firebase.messaging().getToken().then(
        (t) => {
          console.log(t);

        }
      ).catch((e) => {
        console.log(e);
      })
      firebase.messaging().onMessage(x => {
        console.log(x);
      });

      this.statusBar.overlaysWebView(true);
      this.statusBar.styleBlackTranslucent();
      this.statusBar.backgroundColorByHexString("#734b6d");


      //this.splashScreen.hide();

    });


  }


}
