import { Component,Inject } from '@angular/core';
import { NavController, Platform, AlertController} from 'ionic-angular';
import{MusicService} from '../../providers/musicservice';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import{Player} from '../player/player';
import{Artist} from '../artist/artist';
import{Menu} from '../menu/menu';
import{Album} from '../album/album';
import{Video} from '../video/video';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase'
import { AuthService } from '../../providers/auth-service';
import{Favorite} from '../../providers/favorite';
import { MusicData } from '../../providers/music-data';
import "rxjs/add/operator/map";
import  'rxjs/add/operator/take'
import { SplashScreen } from '@ionic-native/splash-screen';
import { BackgroundMode } from '@ionic-native/background-mode';
//By Rekar Dilzar Rashid Botany +9647504051800
import { Storage } from '@ionic/storage';
import{WelcomePage} from '../welcome/welcome';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'

})
export class HomePage {
  tracks:any;
  newVideos:any[]=[];
  newArtists:FirebaseListObservable<any>;
  newAlbums:FirebaseListObservable<any>;
  newTracks:FirebaseListObservable<any>;
  allTracks:FirebaseListObservable<any>;
  allVideos:FirebaseListObservable<any>;
  allAlbums:FirebaseListObservable<any>;
  allArtists:FirebaseListObservable<any>;
  popularTracks:FirebaseListObservable<any>;
  popularVideos:FirebaseListObservable<any>;
  popularAlbums:FirebaseListObservable<any>;
  popularArtists:FirebaseListObservable<any>;
  newPlaylists:FirebaseListObservable<any>;
myTracks:any;
playlists:any[]=[];
videoPlaylists:any[]=[];
popularTracksPlaylists:any[]=[];
popularVideosPlaylists:any[]=[];
popularArtistsPlaylists:any[]=[];
popularAlbumsPlaylists:any[]=[];
videob:boolean=false;
trackb:boolean=false;
artistb:boolean=false;
albumb:boolean=false;
loadedNewAlbum:boolean = false;
  constructor( public storage: Storage, public bg: BackgroundMode, public splashScreen: SplashScreen,public alert: AlertController, 
  public platform: Platform, public md :MusicData,private _auth: AuthService,public navCtrl: NavController,
  public musicservice:MusicService,public af: AngularFireDatabase) 
  {

storage.get('follow').then((val) => {
   if(val != null){
   //this.navCtrl.push(WelcomePage);

  }
   else{
this.navCtrl.push(WelcomePage);
storage.set('follow',true);
   }
       })
       
    platform.ready().then(() => {

if (this.splashScreen) {
setTimeout(() => {
this.splashScreen.hide();
}, 500);
  }

   platform.registerBackButtonAction(() => {
            if(this.navCtrl.canGoBack()){
              this.navCtrl.pop();
            }
            else{
              this.bg.moveToBackground();
            }
          });
    });

  this.allAlbums = this.md.albums;
  this.allArtists = this.md.artists;
  this.allTracks = this.md.tracks;
  this.allVideos = this.md.videos;

this.md.newAlbums.subscribe(x => {this.loadedNewAlbum=true});
  //this.newArtists = this.md.newArtists;
  this.newAlbums = this.md.newAlbums;
  this.newTracks = this.md.newTracks;
  //this.newPlaylists = this.md.newPlaylists;
this.popularTracks=this.md.popularTrack;
this.popularVideos=this.md.popularVideos;
//this.popularAlbums=this.md.popularAlbum;
this.popularArtists=this.md.popularArtist;

this.newTracks.subscribe(snapshots=>{
this.playlists=[];
        snapshots.forEach(element => {

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
album:element.albumName,
artistName:element.artistName 
      }
          );
        });
});


this.allVideos.subscribe(snapshots=>{
this.videoPlaylists=[];
        snapshots.forEach(element => {
if(element.video){
          this.videoPlaylists.push( 

      {src: element.url,
        video: element.video,
      artist: element.artistName,
      title: element.name,
      art: element.albumArt,
      preload: 'metadata',
   key:element.$key,
  artistId:element.artist,
albumId:element.album,
album:element.albumName,
artistName:element.artistName 
      }
          );
}

        });
});



    this.popularVideos.subscribe(pop=>{
             if(this.videob==false){
            this.popularVideosPlaylists=[];
        pop.forEach(pope => {
          this.allTracks.subscribe(all=>{
          all.forEach(alle=>{
            if(alle.$key==pope.$key){


     this.popularVideosPlaylists.push( 

      {src: alle.url,
        video: alle.video,
      artist: alle.artistName,
      title: alle.name,
      art: alle.albumArt,
      preload: 'metadata',
    key:alle.$key,
  artistId:alle.artist,
albumId:alle.album,
album:alle.albumName,
artistName:alle.artistName,
 }  

          );


          }})})});
      this.videob=true;  
      }});



          this.popularTracks.subscribe(pop=>{
             if(this.trackb==false){
            this.popularTracksPlaylists=[];
        pop.forEach(pope => {
          this.allTracks.subscribe(all=>{
          all.forEach(alle=>{
            if(alle.$key==pope.$key){


     this.popularTracksPlaylists.push( 

      {src: alle.url,
        video: alle.video,
      artist: alle.artistName,
      title: alle.name,
      art: alle.albumArt,
      preload: 'metadata',
    key:alle.$key,
  artistId:alle.artist,
albumId:alle.album,
album:alle.albumName,
artistName:alle.artistName,
 }  

          );


          }})})});
      this.trackb=true;  
      }});







              this.popularArtists.subscribe(pop=>{
                 if(this.artistb==false){

                this.popularArtistsPlaylists=[];
        pop.forEach(pope => {
          this.allArtists.subscribe(all=>{
          all.forEach(alle=>{
            if(alle.$key==pope.$key){


     this.popularArtistsPlaylists.push( 
alle

          );


              }})})});
                  this.artistb=true;  
}});







 




this.tracks=this.musicservice.audio.tracks[0];


  }





gotoartist(artistKey){
  this.navCtrl.push(Artist,{'artistKey':artistKey});
}



 gotoalbum(albumKey,artistKey){
    this.navCtrl.push(Album,{
  
      albumKey:albumKey,
    artistKey:artistKey    })
  }










menu(){

 this.navCtrl.push(Menu);
  
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


playVideo(track){
  this.musicservice.pause();
  this.navCtrl.push(Video,{
    videos:this.videoPlaylists,
    video:this.videoPlaylists[track]
  })


}


playpopVideo(track){
  this.musicservice.pause();
  this.navCtrl.push(Video,{
    videos:this.popularVideosPlaylists,
    video:this.popularVideosPlaylists[track]
  })
}





















play(track){
  this.musicservice.play(this.playlists,track);
this.tracks=this.musicservice.audio.tracks[0];

}


playpop(track){
  this.musicservice.play(this.popularTracksPlaylists,track);
this.tracks=this.musicservice.audio.tracks[0];

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


}
