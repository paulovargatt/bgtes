import { Component } from '@angular/core';
import { NavController, Platform, AlertController, ActionSheetController } from 'ionic-angular';
import{MusicService} from '../../providers/musicservice';
import{Favorite} from '../../providers/favorite';
import{MusicData} from '../../providers/music-data';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import{Player} from '../player/player';
import{Share} from '../share/share';
import{Artist} from '../artist/artist';
import{Album} from '../album/album';

import { BackgroundMode } from '@ionic-native/background-mode';
//By Rekar Dilzar Rashid Botany +9647504051800


import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase'


@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html'
})
export class FavoritesPage {
   tracks:any;
  myTracks:any[]=[];
  actions:any;
  opened:boolean=false;
  constructor(public bg: BackgroundMode,public actionSheetCtrl: ActionSheetController,public alert: AlertController, 
  public platform: Platform, public navCtrl: NavController,public musicservice:MusicService,public fav:Favorite,
  public af:AngularFireDatabase,public md:MusicData) {
  platform.ready().then(() => {

   platform.registerBackButtonAction(() => {
             if(this.opened){
               this.opened=false;  
setTimeout(() => {
   this.actions.dismiss();
}, 100);         }
            else if(this.navCtrl.canGoBack()){
              this.navCtrl.pop();
            }
            else{
              this.bg.moveToBackground();
            }
          });
    });

    this.fav.favorites.subscribe(fav=>{
 this.myTracks=[];
 fav.forEach(element => {

this.md.tracks.subscribe(tracks=>{
tracks.forEach(track=>{

if(element.$key==track.$key){
this.myTracks.push({
  src: track.url,
  video: track.video,
      artist: track.artistName,
      title: track.name,
      art: track.albumArt,
      preload: 'metadata',
   key:track.$key,
  artistId:track.artist,
albumId:track.album,
album:track.albumName,
artistName:track.artistName 
});

}
})

})


   
 });
})




this.tracks=this.musicservice.audio.tracks[0];
  }





  shuffle(){
  let t=Math.floor((Math.random() * (this.myTracks.length)) + 0);
  this.musicservice.play(this.myTracks,t);
this.tracks=this.musicservice.audio.tracks[0];
this.musicservice.shuffle=true;

}



 gotoartist2(track){
  this.navCtrl.push(Artist,{'artistKey':track.artistId});
}



 gotoalbum2(track){
    this.navCtrl.push(Album,{
  
      albumKey:track.albumId,
    artistKey:track.artistId   })
  }


more(track) {
   this.actions = this.actionSheetCtrl.create({
     title: track.name,
     buttons: [
      
      {
         text: 'Remove from favorites',
         handler: () => {
                      this.opened=false;

           this.fav.unFavorite(track.key)
         }
       },
       {
         text: 'Add to Playlist',
         handler: () => {
           this.opened=false;
           this.fav.playlistAlert(track.key)
         }
       },
       {
         text: 'Go to Artist',
         handler: () => {
                      this.opened=false;

           this.gotoartist2(track);
         }
       },
       {
         text: 'Go to Album',
         handler: () => {
                      this.opened=false;

           this.gotoalbum2(track);
         }
       },
       {
         text: 'Share',
         handler: () => {
                      this.opened=false;

   this.shareTrack2(track);
         }
       },
       {
         text: 'Cancel',
         role: 'cancel',
         handler: () => {
           this.opened=false;
 
        }

       }
     ]
   });

   this.actions.present();
   this.opened=true;
 }


shareTrack2(track){

this.navCtrl.push(Share,{
  title:track.title,
  artist:track.artistName,
  art:track.art,
    album:track.albumName


})


}







shareTrack(title,subtitle,art,album){

this.navCtrl.push(Share,{
  title:title,
  subtitle:subtitle,
  art:art,
  album:album

})


}

gotoartist(id){
  this.navCtrl.push(Artist,{'artistKey':id});
}



 gotoalbum(albumId,artistId){
    this.navCtrl.push(Album,{
  
      albumKey:albumId,
    artistKey:artistId    })
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


play(track){
  this.musicservice.play(this.myTracks,track);
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
