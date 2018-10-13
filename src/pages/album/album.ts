import { Component,Inject } from '@angular/core';
import { NavController,NavParams, ActionSheetController , Platform} from 'ionic-angular';
import{MusicService} from '../../providers/musicservice';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import{Player} from '../player/player';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase'
import { AuthService } from '../../providers/auth-service';
import{Favorite} from '../../providers/favorite';
import {Artist} from '../artist/artist';
import {Share} from '../share/share';
import { SocialSharing } from '@ionic-native/social-sharing';

//By Rekar Dilzar Rashid Botany +9647504051800
import { BackgroundMode } from '@ionic-native/background-mode';

@Component({
  selector: 'page-album',
  templateUrl: 'album.html'
})



export class Album {
  tracks:any;
  playlists:any[]=[];
  trackss:FirebaseListObservable<any>;
artistName:any;
albumName:any;
artistKey:any;
albumKey:any;
albumImage:number;
artistId:number;
cover:any;
tabBarElement:any;
  actions:any;
  opened:boolean=false;
  constructor(public bg:BackgroundMode,public platform: Platform, public favorite: Favorite,
  public actionSheetCtrl: ActionSheetController, public params:NavParams,private _auth: AuthService,public navCtrl: NavController,
  public musicservice:MusicService,public af: AngularFireDatabase) 
  {
  

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
    
        this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
this.tabBarElement.style.display = 'none';


this.artistKey=this.params.get('artistKey');
this.albumKey=this.params.get('albumKey');


  this.trackss = af.list('/tracks/',{query:{
        orderByChild: 'album',
    equalTo: this.albumKey 
  }});



this.trackss.subscribe(snapshots=>{

        snapshots.forEach(element => {
          this.artistName=element.artistName;

          this.playlists.push( 

      {src: element.url,
        video: element.video,
      artist: element.artistName,
      title: element.name,
      art: element.albumArt,
      preload: 'metadata',
    key:element.$key,
  artistId:element.artist,
albumId:element.album,
album:element.albumName }  

          );
        });
          });
  


      this.af.list('/albums', { preserveSnapshot: true,query : {
 orderByKey: true,
    equalTo: this.albumKey 
      }})
    .subscribe(snapshots=>{
this.albumName=snapshots[0].val().name;
        this.albumImage=snapshots[0].val().image;
          })



  

this.tracks=this.musicservice.audio.tracks[0];
  }











  ngAfterContentInit() {     
    // get all tracks managed by AudioProvider so we can control playback via the APIs
this.tracks=this.musicservice.audio.tracks[0];

   IntervalObservable.create(200).subscribe(n => {
        this.tracks=this.musicservice.audio.tracks[0];

    });

  }

ionViewWillLeave() {
this.tabBarElement.style.display = 'flex';}

   ionViewWillEnter(){
            this.tabBarElement.style.display = 'none';

   this.tracks=this.musicservice.audio.tracks[0];

   }


play(track){
  this.musicservice.play(this.playlists,track);
this.tracks=this.musicservice.audio.tracks[0];

}

shuffle(){
  let t=Math.floor((Math.random() * (this.playlists.length)) + 0);
  this.musicservice.play(this.playlists,t);
this.tracks=this.musicservice.audio.tracks[0];
this.musicservice.shuffle=true;

}



next(){
  this.musicservice.next();
this.tracks=this.musicservice.audio.tracks[0];

}


finish(){
  this.musicservice.finish();
  console.log("finish method");
}

player(){
  this.navCtrl.push(Player);
}

 
 gotoartist(track){
  this.navCtrl.push(Artist,{'artistKey':track.artist});
}






more(track) {
   this.actions = this.actionSheetCtrl.create({
     title: track.name,
     buttons: [
      
      {
         text: 'Add to favorites',
         handler: () => {
              this.opened=false;

           this.favorite.favorite(track.$key)
         }
       },
       {
         text: 'Add to Playlist',
         handler: () => {
           this.opened=false;
           this.favorite.playlistAlert(track.$key)
         }
       },
       {
         text: 'Go to Artist',
         handler: () => {
              this.opened=false;

           this.gotoartist(track);
         }
       },
       {
         text: 'Share',
         handler: () => {
              this.opened=false;

   this.shareTrack(track);
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


shareTrack(track){

this.navCtrl.push(Share,{
  title:track.name,
  artist:track.artistName,
  art:track.albumArt,
    album:track.albumName


})


}



}
 
