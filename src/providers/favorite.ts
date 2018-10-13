import { Injectable,Input, Inject } from '@angular/core';
import { AudioProvider } from '../app/shared/audio/ionic-audio-providers';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { ToastController, AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import {AuthService}from './auth-service'
import  'rxjs/add/operator/take'

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase';
/*
  Generated class for the Favorite provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Favorite {
favorites:FirebaseListObservable<any>;
playlists:FirebaseListObservable<any>;
fav:any[]=[];
uid:any;
list:any;
islist:boolean=false;
newlist:any;
isnewlist:boolean=false;
following:FirebaseListObservable<any>;
fol:any[]=[];
tracks:FirebaseListObservable<any>;
popb:boolean=false;
allpopular:any[]=[];
  constructor(public alertCtrl: AlertController, public af: AngularFireDatabase, public afAuth: AngularFireAuth,@Inject(FirebaseApp) public fire: any,
  public toast: ToastController,public auth:AuthService) {
this.uid=this.auth.uid;
this.favorites=this.af.list('favorites/'+this.uid)
this.playlists=this.af.list('playlists/'+this.uid)
this.favorites.subscribe(fav=>{
 this.fav=[];

 fav.forEach(element => {

   this.fav.push(element.$key)
 });
})
this.favorites.take(1);


this.following=this.af.list('following/'+this.uid)
this.following.subscribe(fav=>{
 this.fol=[];

 fav.forEach(element => {

   this.fol.push(element.$key);

 });
})
this.following.take(1);


this.tracks=this.af.list('/tracks');
this.tracks.take(1);


this.tracks.subscribe(all => {
                  if (this.popb == false) {

            this.allpopular = [];
            all.forEach(alle => {

                this.following.subscribe(fav => {
                  fav.forEach(art => {
                    if (art.$key == alle.artist) {
                      this.allpopular.push(

                        {
                          src: alle.url,
                          video: alle.video,
                          artist: alle.artistName,
                          title: alle.name,
                          art: alle.albumArt,
                          preload: 'metadata',
                          key: alle.$key,
                          artistId: alle.artist,
                          albumId: alle.album,
                          album: alle.albumName,
                          artistName: alle.artistName,
                        }

                      );
                      this.allpopular=this.Shuffle(this.allpopular);
                    }
                  })
                });

              
            })
             this.popb = true;
      }
          })






  }


  toggleFollow(key) {

    if (this.isFollow(key)) {
      this.unFollow(key);
    }
    else {
      this.follow(key);
    }

  }
  
Shuffle(o) {
	for(var j, x, i = o.length; i; j = Math.trunc(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
}

 isFollow(key){
//console.log(this.fav);



   if(this.fol.indexOf(key)>-1){
     return true;

   }
   else{
     return false;
   }


  }

 follow(key){
    //console.log(track);
    if(this.isFollow(key)){

    }
    else{
    this.af.list('followedArtist/'+key+'/followed/'+this.uid).push(true);  
    this.af.list('following/'+this.uid+"/"+key).push(true).then(x => {

this.following.subscribe(fav=>{
 this.fol=[];
 fav.forEach(element => {

   this.fol.push(element.$key)
 });
})
this.following.take(1);
    })

  
}
  }

  unFollow(key){
 this.af.list('followedArtist/'+key+'/followed/').remove(this.uid);
   
    this.following.remove(key).then(x => {
this.following.subscribe(fav=>{
 this.fol=[];
 fav.forEach(element => {

   this.fol.push(element.$key)
 });
})
this.following.take(1);
   
    })
  }


 


  like(track){
   
    this.af.list('likedTrack/'+track+'/liked/'+this.uid).push(true);  

  }

   unLike(track){
   this.af.list('likedTrack/'+track+'/liked/').remove(this.uid);
   
  }

  

  



 isFav(track){
//console.log(this.fav);



   if(this.fav.indexOf(track)>-1){
     return true;

   }
   else{
     return false;
   }


  }

  favorite(track){
    //console.log(track);
    if(this.isFav(track)){

    }
    else{
      this.like(track);
    this.af.list('favorites/'+this.uid+"/"+track).push(true).then(x => {

this.favorites.subscribe(fav=>{
 this.fav=[];
 fav.forEach(element => {

   this.fav.push(element.$key)
 });
})
this.favorites.take(1);
    })

  
}
  }

  unFavorite(track){
          this.unLike(track);

    this.favorites.remove(track).then(x => {
this.favorites.subscribe(fav=>{
 this.fav=[];
 fav.forEach(element => {

   this.fav.push(element.$key)
 });
})
this.favorites.take(1);
    })
   
  }


playlist(list,track){
   
    this.af.list('playlists/'+this.uid+'/'+list+'/tracks/'+track).push(true)

  

  }

  newplaylist(list,track){
   this.af.list('playlists'+'/'+this.uid+'/').push({
     name:list,
     tracks:{
       [track]:{
         1:true
       }
     }
   });

  }


    unPlaylist(list,track){
    this.af.list('playlists/'+this.uid+'/'+list+'/tracks/').remove(track);
   
  }


  addNewPlaylistAlert(track) {
  this.newlist = this.alertCtrl.create({
    title: 'New Playlist',
    inputs: [
      {
        name: 'name',
        placeholder: 'playlist name'
      }
    ],
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: data => {
this.isnewlist=false;        }
      },
      {
        text: 'Add',
        handler: data => {
          this.isnewlist=false;
          this.newplaylist(data.name,track)
        }
      }
    ]
  });
  this.newlist.present();
  this.isnewlist=true;
}


playlistAlert(track) {

   this.list= this.alertCtrl.create();
    
    this.list.setTitle('Select a Playlist');
    this.list.addInput({type: 'radio', label: 'New Playlist', value: 'new',name:'list'});
    this.af.list('playlists/'+this.uid).subscribe(l => {
      l.forEach(x=>{
            this.list.addInput({type: 'radio', label: x.name, value: x.$key,name:'list'});

      })
    });

   this.list.addButton({
      text: 'Cancel',
      handler: data => {
this.islist=false;
     
    
      }
    });    
    this.list.addButton({
      text: 'OK',
      handler: data => {
this.islist=false;
        if(data=='new'){
          this.addNewPlaylistAlert(track);
        }
        else{
            this.playlist(data,track);
        }
    
      }
    });

  this.list.present();
this.islist=true;
}

}
