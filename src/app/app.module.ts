import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Facebook } from '@ionic-native/facebook';
import { Player } from '../pages/player/player';
import { Video } from '../pages/video/video';
import { Safe } from '../pipes/safe';
import {Share} from '../pages/share/share';
import {About} from '../pages/about/about';
import {Menu} from '../pages/menu/menu';
import { InAppBrowser } from '@ionic-native/in-app-browser';
//By Rekar Dilzar Rashid Botany +9647504051800

import { SearchPage } from '../pages/search/search';
import { LibraryPage } from '../pages/library/library';
import { PlaylistPage } from '../pages/playlist/playlist';
import { FavoritesPage } from '../pages/favorites/favorites';
import { HomePage } from '../pages/home/home';
import { MoodsPage } from '../pages/moods/moods';
import { Mood } from '../pages/mood/mood';
import { Artist } from '../pages/artist/artist';
import { Album } from '../pages/album/album';
//By Rekar Dilzar Rashid Botany +9647504051800

import { TabsPage } from '../pages/tabs/tabs';
//By Rekar Dilzar Rashid Botany +9647504051800

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
//By Rekar Dilzar Rashid Botany +9647504051800

import { SharedModule } from './shared/shared.module';
import {IonicAudioModule} from './shared/audio/ionic-audio.module'
import { AuthService } from '../providers/auth-service';

import { SocialSharing } from '@ionic-native/social-sharing';

import { Login } from '../pages/login/login';

// Import the AF2 Module
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';

 import { AngularFireOfflineModule } from 'angularfire2-offline';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { BackgroundMode } from '@ionic-native/background-mode';
import { Keyboard } from '@ionic-native/keyboard';

import { IonicStorageModule } from '@ionic/storage';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { WelcomePage } from '../pages/welcome/welcome';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Offline } from '../providers/offline';
import { FilePath } from '@ionic-native/file-path';
import {HttpClientModule, HttpClient} from '@angular/common/http';

// AF2 Settings

//Replace this with your own keys from console.firebase.com
export const firebaseConfig = {
  apiKey: "AIzaSyD70l8eAE8lEOw4ggZElSLbgoykOCF6BeM",
    authDomain: "awaza-47e7f.firebaseapp.com",
    databaseURL: "https://awaza-47e7f.firebaseio.com",
    projectId: "awaza-47e7f",
    storageBucket: "awaza-47e7f.appspot.com",
    messagingSenderId: "739916983861"
};

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}





@NgModule({
  declarations: [
Safe,
    MyApp,
     WelcomePage,
    SearchPage,
    Player,
    About,
    LibraryPage,
    FavoritesPage,
    PlaylistPage,
    MoodsPage,
    Mood,
    HomePage,
    TabsPage,
    Artist,
    Album,
    Login,
    Share,
    Menu,
    Video,
 
  ],
  imports: [
    HttpClientModule,
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  }),
        SharedModule.forRoot(),
    BrowserModule,
    IonicModule.forRoot(MyApp,{
      backButtonText: '',
   
      
      
    }),
    IonicAudioModule.forRoot(), 
   AngularFireModule.initializeApp(firebaseConfig),
     AngularFireDatabaseModule,
    AngularFireAuthModule,

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
     WelcomePage,
    SearchPage,
    LibraryPage,
    FavoritesPage,
    PlaylistPage,
    HomePage,
    MoodsPage,
    Mood,
    About,
    Player,
    Artist,
    Album,
    TabsPage,
    Login,
    Share,
    Menu,
    Video,
  ],
  providers: [
    FilePath,
    FileTransfer,
    File,
    FileTransferObject,
    ScreenOrientation,
    BackgroundMode,
    InAppBrowser,
    AuthService,
    Keyboard,
    Facebook,
    StatusBar,
    SplashScreen,
    SocialSharing,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Offline
  ]
})
export class AppModule {}
