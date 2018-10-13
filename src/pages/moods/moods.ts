import { Component } from '@angular/core';
import { NavController, Platform, AlertController } from 'ionic-angular';
import{MusicService} from '../../providers/musicservice';
import{Favorite} from '../../providers/favorite';
import{MusicData} from '../../providers/music-data';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import{Player} from '../player/player';
import{Mood} from '../mood/mood';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase'
import { BackgroundMode } from '@ionic-native/background-mode';
//By Rekar Dilzar Rashid Botany +9647504051800



@Component({
  selector: 'page-moods',
  templateUrl: 'moods.html'
})
export class MoodsPage {
   moods:FirebaseListObservable<any>;
  moodsList:any[]=[];
  tracks:any;

  constructor(public bg: BackgroundMode,public alert: AlertController, public platform: Platform, public navCtrl: NavController
  ,public musicservice:MusicService,public fav:Favorite,public af:AngularFireDatabase,public md:MusicData) {
    
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

   




this.moods= this.af.list('/moods',{preserveSnapshot: true});
this.tracks=this.musicservice.audio.tracks[0];
  }

  ngAfterContentInit() {     
    // get all tracks managed by AudioProvider so we can control playback via the APIs
this.tracks=this.musicservice.audio.tracks[0];

   IntervalObservable.create(200).subscribe(n => {
        this.tracks=this.musicservice.audio.tracks[0];

    });

  }

moodOpen(moodData) {
this.navCtrl.push(Mood, {
  mood: moodData
})
}

   ionViewWillEnter(){
   this.tracks=this.musicservice.audio.tracks[0];

   }




player(){
  this.navCtrl.push(Player);
}


next(){
  this.musicservice.next();
this.tracks=this.musicservice.audio.tracks[0];

}


}
