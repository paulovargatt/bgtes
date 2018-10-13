import { Component } from '@angular/core';
import { NavController,Platform, AlertController, ActionSheetController } from 'ionic-angular';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import{MusicService} from '../../providers/musicservice';
import{MusicData} from '../../providers/music-data';
import{Player} from '../player/player';
import{Album} from '../album/album';
import{Artist} from '../artist/artist';
import{Favorite} from '../../providers/favorite';
import{Share} from '../share/share';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase';

import {Subject} from 'rxjs/Subject';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Keyboard } from '@ionic-native/keyboard';
//By Rekar Dilzar Rashid Botany +9647504051800

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {
 tracks:any;
  artists:FirebaseListObservable<any>;
  albums:FirebaseListObservable<any>;
  trackss:FirebaseListObservable<any>;

  searchArtist:Array<any>=[];
  searchAlbum:Array<any>=[];
  searchTracks: Array<any>=[];
playlists:any[]=[];
keyboard:boolean;
result:boolean = true;
  actions:any;
  opened:boolean=false;

  constructor(public kb: Keyboard, public bg: BackgroundMode, public actionSheetCtrl: ActionSheetController, public favorite: Favorite,public alert: AlertController, public platform: Platform, public navCtrl: NavController,public musicservice:MusicService,
  public af: AngularFireDatabase,public md:MusicData) {

    
this.kb.hideKeyboardAccessoryBar(false);

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


this.tracks=this.musicservice.audio.tracks[0];



this.trackss=this.md.tracks;


this.albums=this.md.albums;

this.artists=this.md.artists;


this.kb.onKeyboardShow().subscribe(data => {
       this.keyboard=true;
    });

    this.kb.onKeyboardHide().subscribe(data => {
       this.keyboard=false;
    });






  }


hidekb() {

  if(this.keyboard){
  this.kb.close();}

}

 gotoartist(track){
  this.navCtrl.push(Artist,{'artistKey':track});
}



 gotoalbum(album,artist){
    this.navCtrl.push(Album,{
  
      albumKey:album,
    artistKey:artist   })
  }



   gotoartistt(track){
  this.navCtrl.push(Artist,{'artistKey':track.artist});
}



 gotoalbumt(track){
    this.navCtrl.push(Album,{
  
      albumKey:track.album,
    artistKey:track.artist   })
  }


more(track) {
   this.actions= this.actionSheetCtrl.create({
     title: track.name,
     buttons: [
      
      {
         text: 'Add to favorite',
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
           this.gotoartistt(track);
         }
       },
       {
         text: 'Go to Album',
         handler: () => {
           this.opened=false;  
           this.gotoalbumt(track);
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
this.opened=false;         }
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








play(track,i){
  

  this.musicservice.play(this.playlists,i);
this.tracks=this.musicservice.audio.tracks[0];

}



  search(ev) {
    
          this.result=true;

        var val = ev.target.value;
        if(val){
          this.result=false;
if(val != "" && val.length >= 3){

        this.trackss.subscribe((_items)=> {
            this.searchTracks = [];
            this.playlists=[];
            _items.forEach(item => {
                if(( item.name.toLowerCase().indexOf(val.toLowerCase()) > -1) || ( item.artistName.toLowerCase().indexOf(val.toLowerCase()) > -1) 
                ) {
                            this.result=true;

                    this.searchTracks.push(item);
                    this.playlists.push( 

      {src: item.url,
        video: item.video,
      artist: item.artistName,
      title: item.name,
      art: item.albumArt,
      preload: 'metadata',
    key:item.$key,
  artistId:item.artist,
albumId:item.album,
album:item.albumName}  

          );
                } 
            })
        }); 



        this.albums.subscribe((_items)=> {
            this.searchAlbum = [];
            _items.forEach(item => {
                if(( item.name.toLowerCase().indexOf(val.toLowerCase()) > -1) || ( item.artistName.toLowerCase().indexOf(val.toLowerCase()) > -1)) {
                    this.searchAlbum.push(item);
                    
                } 
            })
        }); 



        this.artists.subscribe((_items)=> {
            this.searchArtist = [];
            _items.forEach(item => {
                if(( item.name.toLowerCase().indexOf(val.toLowerCase()) > -1) ) {
                    this.searchArtist.push(item);
                } 
            })
        });  







}


else{

            this.searchTracks = [];
            this.searchArtist = [];
            this.searchAlbum = [];

}

  }

  else {
    this.searchTracks = [];
            this.searchArtist = [];
            this.searchAlbum = [];
  }
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
  console.log("finish method");
}

player(){
  this.navCtrl.push(Player);
}


}
