import { Component,ViewChild,trigger,transition,style,animate,state,group,keyframes } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase'
import{Favorite} from '../../providers/favorite';
import { MusicData } from '../../providers/music-data';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the WelcomePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',


})
export class WelcomePage {
  tabBarElement:any;

state:any='true';
  popularArtists:FirebaseListObservable<any>;
popularArtistsPlaylists:any[]=[];
artistb:boolean=false;
allArtists:FirebaseListObservable<any>;
  constructor(public md:MusicData,public fav:Favorite,public platform: Platform, public navCtrl: NavController, public navParams: NavParams) {
this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
this.tabBarElement.style.display = 'none';


this.popularArtists=this.md.popularArtist;
this.allArtists=this.md.artists;



             

                this.popularArtistsPlaylists=[];
       
          this.allArtists.subscribe(all=>{
          all.forEach(alle=>{
     this.popularArtistsPlaylists.push(alle);
              })})



    platform.ready().then(() => {
      platform.registerBackButtonAction(() => {

      });
    });
  }

  isf(key){
    if(this.fav.isFollow(key)) return 'true';
    else return 'false';
  }
  isnf(key){
    if(this.fav.isFollow(key)) return 'false';
    else return 'true';
  }

  ionViewDidLoad() {
  }
  ionViewWillLeave() {
        this.tabBarElement.style.display = 'flex';

  }


  ionViewWillEnter() {
this.tabBarElement.style.display = 'none';
  }

  

 

}
