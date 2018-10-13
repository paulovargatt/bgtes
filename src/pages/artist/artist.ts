import { Component,Inject } from '@angular/core';
import { NavController,NavParams, Platform } from 'ionic-angular';
import{MusicService} from '../../providers/musicservice';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import{Player} from '../player/player';
import{Album} from '../album/album';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase'
import { AuthService } from '../../providers/auth-service';
import{Favorite} from '../../providers/favorite';
//By Rekar Dilzar Rashid Botany +9647504051800

import { BackgroundMode } from '@ionic-native/background-mode';

@Component({
  selector: 'page-artist',
  templateUrl: 'artist.html'

})
export class Artist {
  tracks:any;
  trackss:any;
  albums:FirebaseListObservable<any>;
artistImage:any;
artistKey:number;
artistName:any;
  playlists:any[]=[];
tabBarElement:any;
follow:any;
followNum:number=0;
  constructor(public fav:Favorite,public bg:BackgroundMode,public platform:Platform, public params:NavParams,private _auth: AuthService,public navCtrl: NavController,public musicservice:MusicService,
  public af: AngularFireDatabase) 
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
this.artistKey=this.params.get('artistKey');


  this.albums = af.list('/albums/',{query:{
        orderByChild: 'artist',
    equalTo: this.artistKey 
  }});


      this.af.list('/artists', { preserveSnapshot: true,query : {
 orderByKey: true,
    equalTo: this.artistKey 
      }})
    .subscribe(snapshots=>{
this.artistName=snapshots[0].val().name;
        this.artistImage=snapshots[0].val().cover;

          })




this.trackss = af.list('/tracks/',{query:{
        orderByChild: 'artist',
    equalTo: this.artistKey 
  }});

this.trackss.subscribe(snapshots=>{

        snapshots.forEach(element => {
          this.artistName=element.artistName;

          this.playlists.push( 

      {src: element.url,
      artist: element.artistName,
      title: element.name,
      art: element.albumArt,
      preload: 'metadata' ,
    key:element.$key,
  artistId:element.artist,
albumId:element.album,
album:element.albumName }  

          );
        });
          });

  

this.tracks=this.musicservice.audio.tracks[0];
  }




  shuffle(){
  let t=Math.floor((Math.random() * (this.playlists.length)) + 0);
  this.musicservice.play(this.playlists,t);
this.tracks=this.musicservice.audio.tracks[0];
this.musicservice.shuffle=true;

}



  gotoalbum(albumKey,artistKey){
    this.navCtrl.push(Album,{
  
      albumKey:albumKey,
    artistKey:artistKey    })
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

this.follow=this.af.list('followedArtist/'+this.artistKey)

this.follow.subscribe(like => {
if(like[0]!= undefined)
this.followNum=like[0].$value ;
else this.followNum=0

}) 
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
 
