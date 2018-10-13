import { Component } from '@angular/core';
import { NavController, Platform, AlertController, ActionSheetController } from 'ionic-angular';
import{MusicService} from '../../providers/musicservice';
import{Favorite} from '../../providers/favorite';
import{MusicData} from '../../providers/music-data';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import{Player} from '../player/player';
import{PlaylistPage} from '../playlist/playlist';
import{FavoritesPage} from '../favorites/favorites';
import{Share} from '../share/share';
import{Artist} from '../artist/artist';
import{Album} from '../album/album';

import { BackgroundMode } from '@ionic-native/background-mode';
//By Rekar Dilzar Rashid Botany +9647504051800
import{WelcomePage} from '../welcome/welcome';


import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase'


@Component({
  selector: 'page-library',
  templateUrl: 'library.html'
})
export class LibraryPage {
   tracks:any;
   playlists:FirebaseListObservable<any>;
   artists:any[]=[];
  constructor(public bg: BackgroundMode,public actionSheetCtrl: ActionSheetController,public alert: AlertController, 
  public platform: Platform, public navCtrl: NavController,public musicservice:MusicService,public fav:Favorite,
  public af:AngularFireDatabase,public md:MusicData) {
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
this.playlists=this.md.playlists;
this.md.playlists.subscribe(x => {
})
this.tracks=this.musicservice.audio.tracks[0];
  





this.fav.following.subscribe(fav=>{
 this.artists=[];
 fav.forEach(element => {

this.md.artists.subscribe(tracks=>{
tracks.forEach(track=>{

if(element.$key==track.$key){
  console.log(element);
this.artists.push({
  cover: track.cover,
  image: track.image,
  name: track.name,
  key:track.$key
});

}
})

})


   
 });
})





}



playmix(track){
  this.musicservice.play(this.fav.allpopular,track);
this.tracks=this.musicservice.audio.tracks[0];

}

followArtist(){
  this.navCtrl.push(WelcomePage);

}


favorites(){
  this.navCtrl.push(FavoritesPage);
}


playlist(id,name){
  this.navCtrl.push(PlaylistPage,{
    playlist:id,
    name:name
  });
}

gotoartist(artistKey){
  this.navCtrl.push(Artist,{'artistKey':artistKey});
}



  ngAfterContentInit() {     
    // get all tracks managed by AudioProvider so we can control playback via the APIs
this.tracks=this.musicservice.audio.tracks[0];

   IntervalObservable.create(200).subscribe(n => {
        this.tracks=this.musicservice.audio.tracks[0];

    });

  }


   ionViewWillEnter(){
   this.tracks=this.musicservice.audio.tracks[0];

   }




next(){
  this.musicservice.next();
this.tracks=this.musicservice.audio.tracks[0];

}


finish(){
  this.musicservice.finish();
}

player(){
  this.navCtrl.push(Player);
}


}
