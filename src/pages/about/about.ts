import { Component,Inject } from '@angular/core';
import { NavController,NavParams, ActionSheetController,Platform } from 'ionic-angular';
import{MusicService} from '../../providers/musicservice';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import{Player} from '../player/player';

import { AuthService } from '../../providers/auth-service';
import{Favorite} from '../../providers/favorite';
import {Artist} from '../artist/artist';
import {Album} from '../album/album';
import {Share} from '../share/share';
import { SocialSharing } from '@ionic-native/social-sharing';
//By Rekar Dilzar Rashid Botany +9647504051800
import { BackgroundMode } from '@ionic-native/background-mode';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})



export class About {

tabBarElement:any;
  constructor(public bg:BackgroundMode,public platform: Platform, public favorite: Favorite,public actionSheetCtrl: ActionSheetController, 
  public params:NavParams,private _auth: AuthService,public navCtrl: NavController,public musicservice:MusicService,
) 
  {

platform.ready().then(() => {
       platform.registerBackButtonAction(() => {
            if(this.navCtrl.canGoBack()){
              this.navCtrl.pop();
            }
            else{
              this.bg.moveToBackground();
            }
           
          });
    });
  
        this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
this.tabBarElement.style.display = 'none';

          
  }












}
 
