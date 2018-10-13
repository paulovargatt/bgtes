import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase';
import {AuthService}from './auth-service'
import  'rxjs/add/operator/take';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { StatusBar } from '@ionic-native/status-bar';

@Injectable()
export class MusicData {

artists:FirebaseListObservable<any>;
albums:FirebaseListObservable<any>;
tracks:FirebaseListObservable<any>;
videos:FirebaseListObservable<any>;
playlists:FirebaseListObservable<any>;
userPlaylists:FirebaseListObservable<any>;
moods:FirebaseListObservable<any>;
newArtists:FirebaseListObservable<any>;
newAlbums:FirebaseListObservable<any>;
newTracks:FirebaseListObservable<any>;
newPlaylists:FirebaseListObservable<any>;
favorite:FirebaseListObservable<any>;
popularTrack:FirebaseListObservable<any>;
popularVideos:FirebaseListObservable<any>;
popularArtist:FirebaseListObservable<any>;
popularAlbum:FirebaseListObservable<any>;
user:any;
popularTracks:any
full:boolean=false;
  constructor(public Statusbar: StatusBar, public Screenorientation:ScreenOrientation,public af: AngularFireDatabase, public afAuth: AngularFireAuth,@Inject(FirebaseApp) public fire: any,
  private _auth: AuthService) {


this.Screenorientation.onChange().subscribe(a => {
  if(this.Screenorientation.type == 'portrait-primary' || 
  this.Screenorientation.type == 'portrait-secondary' ||
  this.Screenorientation.type == 'portrait'){
    this.full=false;
    this.Statusbar.show();
  }
  else{
    this.Statusbar.hide();
    this.full=true;
  }
})

this.user=this._auth.uid;


this.popularArtist=this.af.list('/popularArtist',{query:{
  orderByChild:"count",
  limitToLast:50
}});


/* this.popularAlbum=this.af.database.list('/popularAlbum',{query:{
  orderByChild:"count",
  limitToFirst:50
}}) */





this.popularTrack=this.af.list('/popularTrack',{query:{
  orderByChild:"count",
  limitToLast:50
}})

this.popularVideos=this.af.list('/popularVideo',{query:{
  orderByChild:"count",
  limitToLast:50
}})

this.popularArtist.take(1);
this.popularVideos.take(1);
//this.popularAlbum.take(1);
this.popularTrack.take(1);


this.artists=this.af.list('/artists')


/* this.newArtists=this.af.database.list('/artists',{
  query:{
    orderByChild:"timestamp",
    limitToLast:50
  }
}).map((array) => array.reverse()) as FirebaseListObservable<any[]>;
*/

this.albums=this.af.list('/albums')
this.newAlbums=this.af.list('/albums',{
  query:{
    orderByChild:"release",
    limitToLast:50
  }
}).map((array) => array.reverse()) as FirebaseListObservable<any[]>;


this.tracks=this.af.list('/tracks')
this.newTracks=this.af.list('/tracks',{
  query:{
    orderByChild:"chosen",
    equalTo:true,
    
    limitToLast:50
  }
}).map((array) => array.reverse()) as FirebaseListObservable<any[]>;


this.videos=this.af.list('/tracks').map((array) => array.reverse()) as FirebaseListObservable<any[]>;


this.playlists=this.af.list('/playlists/'+this.user);
this.favorite=this.af.list('/favorite/'+this.user);

  }

}
