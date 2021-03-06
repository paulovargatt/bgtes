import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ActionSheetController, Platform} from 'ionic-angular';
import {MusicService} from '../../providers/musicservice';
import {MusicData} from '../../providers/music-data';
import {Favorite} from '../../providers/favorite';
import {IntervalObservable} from 'rxjs/observable/IntervalObservable';
import {Album} from '../album/album';
import {Video} from '../video/video';
import {Artist} from '../artist/artist';
import {Share} from '../share/share';
import {SocialSharing} from '@ionic-native/social-sharing';
import {BackgroundMode} from '@ionic-native/background-mode';

//By Rekar Dilzar Rashid Botany +9647504051800

@Component({
  selector: 'page-player',
  templateUrl: 'player.html',
})

export class Player {

  tracks: any;
  playlist: boolean;
  tabBarElement: any;
  actions: any;
  opened: boolean = false;

  constructor(public md: MusicData, public favorite: Favorite, public bg: BackgroundMode, public platform: Platform, public share: SocialSharing, public actionSheetCtrl: ActionSheetController, public navCtrl: NavController, public navParams: NavParams, public musicservice: MusicService) {


    platform.ready().then(() => {
      platform.registerBackButtonAction(() => {
        if (this.opened || this.favorite.islist || this.favorite.isnewlist) {

          this.opened = false;
          this.favorite.islist = false;
          this.favorite.isnewlist = false;

          setTimeout(() => {
            this.actions.dismiss();
            this.favorite.list.dismiss();
            this.favorite.newlist.dismiss();
          }, 100);
        }
        else if (this.navCtrl.canGoBack()) {
          this.navCtrl.pop();
        } else {
          this.bg.moveToBackground();
        }

      });
    });
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.tabBarElement.style.display = 'none';
    this.tracks = this.musicservice.audio.tracks[0];

    this.playlist = false;

  }


  playVideo() {
    this.musicservice.pause();
    this.navCtrl.pop();
    this.navCtrl.push(Video, {
      videos: this.musicservice.tracks,
      video: this.musicservice.playingTrack
    })
  }

  shareTrack() {

    this.navCtrl.push(Share, {
      title: this.tracks.title,
      art: this.tracks.art,
      artist: this.tracks.artist,
      album: this.tracks.album

    })


  }

  gotoartist() {
    this.navCtrl.push(Artist, {'artistKey': this.tracks.artistId});
  }


  gotoalbum() {
    this.navCtrl.push(Album, {

      albumKey: this.tracks.albumId,
      artistKey: this.tracks.artistId
    })
  }

  action() {
    this.actions = this.actionSheetCtrl.create({
      title: this.tracks.title,
      buttons: [
        {
          text: 'Download',
          handler: () => {
            this.opened = false;

            this.musicservice.download();
          }
        },
        {
          text: 'Add to Playlist',
          handler: () => {
            this.opened = false;

            this.favorite.playlistAlert(this.tracks.key);
          }
        },
        {
          text: 'Go to Album',
          handler: () => {
            this.opened = false;

            this.gotoalbum();
          }
        },
        {
          text: 'Go to Artist',
          handler: () => {
            this.opened = false;

            this.gotoartist();
          }
        },
        {
          text: 'Share',
          handler: () => {
            this.opened = false;

            this.shareTrack();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.opened = false;
          }
        }
      ]
    });

    this.actions.present();
    this.opened = true;
  }


  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
    this.playlist = false;

  }


  ngAfterContentInit() {
    // get all tracks managed by AudioProvider so we can control playback via the APIs
    this.tracks = this.musicservice.audio.tracks[0];
    this.playlist = false;

    IntervalObservable.create(200).subscribe(n => {
      this.tracks = this.musicservice.audio.tracks[0];

    });

  }

  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';

    this.playlist = false;
    this.tracks = this.musicservice.audio.tracks[0];


  }


  togglePlaylist() {
    this.playlist = !this.playlist;
  }

  next() {
    if (this.musicservice.wait) {
      console.log("waiting");
    }
    else {
      this.musicservice.next();
      this.tracks = this.musicservice.audio.tracks[0];

    }
  }

  prev() {
    if (this.musicservice.wait) {
      console.log("waiting");
    }
    else {
      this.musicservice.prev();
      this.tracks = this.musicservice.audio.tracks[0];

    }
  }

  fav() {


  }

  more() {
  }


  play(track) {
    this.musicservice.playnext(track);
    this.tracks = this.musicservice.audio.tracks[0];


  }

  swipePlay(event) {
    if (event.direction == 2) {
      this.musicservice.next();
      this.tracks = this.musicservice.audio.tracks[0];

    }
    if (event.direction == 4) {
      this.musicservice.prev();
      this.tracks = this.musicservice.audio.tracks[0];

    }
  }

}




