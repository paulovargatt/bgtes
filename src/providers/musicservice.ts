import {
  Injectable,
  Input,
  Inject
} from '@angular/core';
import {
  AudioProvider
} from '../app/shared/audio/ionic-audio-providers';
import {
  Subscription
} from 'rxjs/Subscription';
import {
  Observable
} from 'rxjs/Observable';
import {
  IntervalObservable
} from 'rxjs/observable/IntervalObservable';
import {
  Favorite
} from './favorite';
import {
  AuthService
} from './auth-service';
import {
  MusicData
} from './music-data';

import {
  Offline
} from './offline';
import {
  MusicControls
} from '@ionic-native/music-controls';

import {
  Platform, AlertController
} from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Storage } from '@ionic/storage';


import { FilePath } from '@ionic-native/file-path';


import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase';

@Injectable()
export class MusicService {
  tracks: any;
  track: any;
  current: any;
  shuffle: boolean;
  repeat: number;
  subscription: Subscription;
  public internalVal = null;
  wait: boolean;
  time: any;
  duration: any;
  ptime: any;
  playingTrack: any;
  timer: any;
  busy: boolean = false;
  error: boolean = true;
  likeNum: number = 0;
  likesData: any;
  off:any;
  storageDirectory:any;
  constructor(public filePath:FilePath,public offline:Offline ,public transfer: FileTransfer, public file: File, public alertCtrl: AlertController, public af: AngularFireDatabase, public afAuth: AngularFireAuth, @Inject(FirebaseApp) public fire: any,
    public platform: Platform, public auth: AuthService, public audio: AudioProvider, public fav: Favorite,
    public musicControls: MusicControls, public md: MusicData) {
    this.wait = false;
    this.shuffle = false;
    this.repeat = 0;
    this.playingTrack = { key: 0 };

 this.platform.ready().then(() => {
      // make sure this is on a device, not an emulation (e.g. chrome tools device mode)
      if(!this.platform.is('cordova')) {
        return false;
      }

      if (this.platform.is('ios')) {
        this.storageDirectory = file.documentsDirectory;
        
      }
      else if(this.platform.is('android')) {
        this.storageDirectory = file.externalRootDirectory+'firespotify/';
      }
      else {
        // exit otherwise, but you could add further types here e.g. Windows
        return false;
      }
    });



  }



  music(track) {
    this.musicControls.updateDismissable(true);

    //this.musicControls.destroy();
    this.musicControls.create({
      track: track.title, // optional, default : ''
      artist: track.artist, // optional, default : ''
      cover: track.art, // optional, default : nothing
      // cover can be a local path (use fullpath 'file:///storage/emulated/...', or only 'my_image.jpg' if my_image.jpg is in the www folder of your app)
      //           or a remote url ('http://...', 'https://...', 'ftp://...')
      isPlaying: true, // optional, default : true
      dismissable: true, // optional, default : false

      // hide previous/next/close buttons:
      hasPrev: true, // show previous button, optional, default: true
      hasNext: true, // show next button, optional, default: true
      hasClose: true, // show close button, optional, default: false

      // iOS only, optional
      album: track.albumName, // optional, default: ''
      duration: this.audio.tracks[this.audio.current].duration, // optional, default: 0
      elapsed: this.audio.tracks[this.audio.current].progress, // optional, default: 0

      // Android only, optional
      // text displayed in the status bar when the notification (and the ticker) are updated
      ticker: 'Now playing ' + track.name
    });





    this.musicControls.subscribe().subscribe(action => {

      switch (action) {
        case 'music-controls-next':
          this.next();
          break;
        case 'music-controls-previous':
          this.prev();
          break;
        case 'music-controls-pause':
          this.pause();
          this.musicControls.updateIsPlaying(false);
          this.musicControls.updateDismissable(true);
          break;
        case 'music-controls-play':
          this.audio.play(0);
          this.musicControls.updateIsPlaying(true);
          this.musicControls.updateDismissable(true);

          break;
        case 'music-controls-destroy':
          this.musicControls.destroy();
          this.stop();
          break;

        // Headset events (Android only)
        case 'music-controls-media-button':
          // Do something
          break;
        case 'music-controls-headset-unplugged':
          this.pause();
          this.musicControls.updateIsPlaying(false);
          this.musicControls.updateDismissable(true);
          break;
        case 'music-controls-headset-plugged':
          this.audio.play(0);
          this.musicControls.updateIsPlaying(true);
          this.musicControls.updateDismissable(true);
          break;



        case 'music-controls-media-button-next':
          this.next();
          break;

        case 'music-controls-media-button-pause':
          this.pause();
          this.musicControls.updateIsPlaying(false);
          this.musicControls.updateDismissable(true);
          break;

        case 'music-controls-media-button-play':
          this.audio.play(0);
          this.musicControls.updateIsPlaying(true);
          this.musicControls.updateDismissable(true);
          break;

        case 'music-controls-media-button-play-pause':
          this.audio.play(0);
          this.musicControls.updateIsPlaying(true);
          this.musicControls.updateDismissable(true);
          break



        case 'music-controls-media-button-previous':
          this.prev();
          break;

        case 'music-controls-media-button-stop':
          this.stop();
          break;

        case 'music-controls-media-button-fast-forward':
          this.seekTo();
          break;

        case 'music-controls-media-button-rewind':
          this.seekBack();
          break;

        case 'music-controls-media-button-skip-backward':
          this.seekBack();
          break;

        case 'music-controls-media-button-skip-forward':
          this.seekTo();
          break;

        case 'music-controls-media-button-step-backward':
          this.seekBack();
          break;

        case 'music-controls-media-button-step-forward':
          this.seekTo();
          break;

        case 'music-controls-media-button-meta-left':

          break;

        case 'music-controls-media-button-meta-right':

          break;

        case 'music-controls-media-button-music':
          this.audio.play(0);
          this.musicControls.updateIsPlaying(true);
          this.musicControls.updateDismissable(true);
          break;

        case 'music-controls-media-button-volume-up':

          break;

        case 'music-controls-media-button-volume-down':

          break;

        case 'music-controls-media-button-volume-mute':

          break;

        case 'music-controls-media-button-headset-hook':
          this.pause();
          this.musicControls.updateIsPlaying(false);
          this.musicControls.updateDismissable(true);
          break;



        default:
          this.audio.play(0);
          break;

      }








    });






    this.musicControls.listen(); // activates the observable above



  }








  progress() {
    return Math.trunc(
      (this.audio.tracks[this.audio.current].progress
        /
        this.audio.tracks[this.audio.current].duration)
      * 100
    );
  }


download(){
  const name=this.tracks[this.current].title+ " - " + this.tracks[this.current].artist+'.mp3';
  this.offline.download(this.tracks[this.current].src,name);
  const namepic=this.tracks[this.current].title+ " - " + this.tracks[this.current].artist+'.png';
  this.offline.download(this.tracks[this.current].art,namepic);
}

retrieve(name){
    

  this.offline.retrieve(name);
}

retrieveImage(){
    const name=this.tracks[this.current].title+ " - " + this.tracks[this.current].artist+'.png';

  this.offline.retrieve(name);
}



  isFav() {
    return this.fav.isFav(this.tracks[this.current].key);
  }

  likes() {
    return 0;
  }



  like() {
    this.fav.like(this.tracks[this.current].key);

  }

  unLike() {
    this.fav.unLike(this.tracks[this.current].key);
  }


  favorite() {
    this.fav.favorite(this.tracks[this.current].key);

  }

  unFavorite() {
    this.fav.unFavorite(this.tracks[this.current].key);
  }


  seekTo() {
    let seek = this.audio.tracks[0].progress + 5;
    this.audio.seekTo(seek);
  }

  seekBack() {
    let seek = this.audio.tracks[0].progress - 5;
    this.audio.seekTo(seek);
  }




  toggleShuffle() {
    this.shuffle = !this.shuffle;
  }


  toggleRepeat() {

    switch (this.repeat) {

      case 0:
        this.repeat = 1;
        break;

      case 1:
        this.repeat = 2;
        break;

      case 2:
        this.repeat = 0;
        break;

    }

  }



  uploadVideoAnalytics(track) {


    this.af.list("popularVideo/" + track.key + "/played").push({
      uid: this.auth.uid,
      timespan: Date.now()
    });
    this.af.list("popularArtist/" + track.artistId + "/played").push({
      uid: this.auth.uid,
      timespan: Date.now()
    });
    this.af.list("popularAlbum/" + track.albumId + "/played").push({
      uid: this.auth.uid,
      timespan: Date.now()
    });


  }


  uploadAnalytics(track) {


    this.af.list("popularTrack/" + track.key + "/played").push({
      uid: this.auth.uid,
      timespan: Date.now()
    });
    this.af.list("popularArtist/" + track.artistId + "/played").push({
      uid: this.auth.uid,
      timespan: Date.now()
    });
    this.af.list("popularAlbum/" + track.albumId + "/played").push({
      uid: this.auth.uid,
      timespan: Date.now()
    });


  }



  play(tracks, track) {
    //console.log(this.wait);
    if (!this.wait) {



      this.wait = true;
      IntervalObservable.create(200).subscribe(n => {
        if (this.audio.current != undefined) {
          this.likesData = this.af.list('likedTrack/' + this.tracks[this.current].key)

          this.likesData.subscribe(like => {
            if (like[0] != undefined)
              this.likeNum = like[0].$value;
            else this.likeNum = 0

          })
        }

        if (this.audio.tracks[0].isLoading == false) {
          this.wait = false;
        } else {
          this.wait = true;
        }
        if (this.audio.tracks[0].isFinished) {
          if (!this.busy) {
            this.finish()
          }
        }
        if (this.audio.tracks[0].error) {
          if (this.error) {
            let alert = this.alertCtrl.create({
              title: 'An Error Occured/No Connection',
              subTitle: 'Restart the app',
              buttons: [{
                text: 'Restart', role: 'cancel',
                handler: () => {
                  window.location.reload();
                }
              }],

            });
            alert.present();
            this.error = false;
          }


        }

      });

      this.playingTrack = tracks[track];
      if (this.audio.current != undefined) {
        this.audio.pause();
        this.audio.seekTo(0);
      }
      this.tracks = tracks;
      this.current = track;
      this.audio.current = 0;
      this.audio.eraseTracks();
 

  /*
const name= tracks[track].title + " - " + tracks[track].artist+'.mp3';
const namep= tracks[track].title + " - " + tracks[track].artist+'.png';
   this.file.checkFile(this.storageDirectory, name)
      .then(x => {
        this.file.readAsDataURL
const path =this.storageDirectory + name.replace(/ /g, '%20');
const pathp =this.storageDirectory + name.replace(/ /g, '%20');

tracks[track].src=path;
tracks[track].art=pathp;
        this.audio.create(tracks[track]);

      this.audio.play(0);


      })
      .catch((err) => {
console.log(err);
  this.audio.create(tracks[track]);
      this.audio.play(0);
      
      });
      */

 this.audio.create(tracks[track]);
      this.audio.play(0);
      
      
      if (this.platform.is('cordova')) {
        this.music(tracks[track]);
        this.musicControls.updateIsPlaying(true);
      }
      this.uploadAnalytics(tracks[track]);

    }
  }


  playtrack(track) {
    this.wait = true;

    if (this.audio.current != undefined) {
      this.audio.pause();
      this.audio.seekTo(0);
    }


    this.audio.eraseTracks();
    this.audio.current = 0;
  

/*
const name= this.tracks[track].title + " - " + this.tracks[track].artist+'.mp3';
const namep= this.tracks[track].title + " - " + this.tracks[track].artist+'.png';
   this.file.checkFile(this.storageDirectory, name)
      .then(x => {
        this.file.readAsDataURL
const path =this.storageDirectory + name.replace(/ /g, '%20');
const pathp =this.storageDirectory + name.replace(/ /g, '%20');
     this.tracks[track].src=path;
this.tracks[track].art=pathp;
        this.audio.create(this.tracks[track]);

      this.audio.play(0);


      })
      .catch((err) => {
  this.audio.create(this.tracks[track]);
      this.audio.play(0);
        

        

      });
*/


  this.audio.create(this.tracks[track]);
      this.audio.play(0);
    

    this.uploadAnalytics(this.tracks[track]);
    this.wait = true;
  }


  playnext(trackk) {
    clearTimeout(this.timer);
    if (this.audio.current != undefined) {
      this.audio.pause();
      this.audio.seekTo(0);
    }

    if (!this.wait) {

const track = trackk;
      

      this.wait = true;

      if (this.audio.current != undefined) {
        this.audio.pause();
        this.audio.seekTo(0);
      }
      this.playingTrack = this.tracks[track];

      this.current = track;

      if (this.platform.is('cordova')) {
        this.music(this.tracks[track]);
      }


      this.timer = setTimeout(() => { this.playtrack(track) }, 500);

    }


  }




  pause() {
    if (this.audio.current != undefined) {
      this.audio.pause();
      this.musicControls.updateIsPlaying(false);
    }
  }

  stop() {
    if (this.audio.current != undefined) {
      this.audio.seekTo(0);
      this.audio.pause();
      this.musicControls.updateIsPlaying(false);


    }
  }






  next() {

    if (this.audio.current != undefined && !this.wait) {

      if (this.shuffle && this.tracks.length != 1) {

        while (true) {
          let t = Math.floor((Math.random() * (this.tracks.length)) + 0);
          if (t != this.current) {
            this.playnext(t);
            break;
          }



        }


      } else {



        if (this.current < this.tracks.length - 1) {
          this.playnext(this.current + 1);
        } else {
          this.playnext(0);
        }



      }


    }
  }





  prev() {
    if (this.audio.current != undefined && !this.wait) {

      if (this.shuffle) {
        while (true) {
          let t = Math.floor((Math.random() * (this.tracks.length)) + 0);
          if (t != this.current) {
            this.playnext(t);
            break;
          }
        }
      } else {



        if (this.current > 0) {
          this.playnext(this.current - 1);
        } else {
          this.playnext(this.tracks.length - 1);
        }



      }


    }
  }




  finish() {
    if (this.audio.current != undefined) {
      this.busy = true;
      if (this.repeat != 2) {

        if (this.shuffle) {
          while (true) {
            let t = Math.floor((Math.random() * (this.tracks.length)) + 0);
            if (t != this.current) {
              this.playnext(t);
              break;
            }
          }
        } else {



          if (this.current < this.tracks.length - 1) {
            this.playnext(this.current + 1);
          } else {
            if (this.repeat == 1) {
              this.playnext(0);
            } else if (this.repeat == 0) {
              //this.stop();
              if (this.platform.is('cordova')) {
                this.musicControls.updateIsPlaying(false);
              }
            } else {
              this.playnext(this.current);

            }
          }



        }

        this.timer = setTimeout(() => { this.busy = false; }, 500);



      } else {
        this.audio.play(0);
        this.uploadAnalytics(this.tracks[this.current]);
        this.timer = setTimeout(() => { this.busy = false; }, 500);
      }


    }
  }















}
