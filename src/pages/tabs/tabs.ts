import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LibraryPage } from '../library/library';
import { SearchPage } from '../search/search';
import { HomePage } from '../home/home';
import { MoodsPage } from '../moods/moods';
//By Rekar Dilzar Rashid Botany +9647504051800

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = SearchPage;
  tab3Root = LibraryPage;
  tab4Root = MoodsPage;

  constructor(platform: Platform, splashScreen: SplashScreen) {

  }
}
