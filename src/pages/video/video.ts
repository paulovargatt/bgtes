import { Component  } from '@angular/core';
import { IonicPage, NavController, NavParams,ActionSheetController,Platform } from 'ionic-angular';
import{MusicService} from '../../providers/musicservice';
import{MusicData} from '../../providers/music-data';
import{Favorite} from '../../providers/favorite';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import {Album} from '../album/album';
import {Artist} from '../artist/artist';
import {Share} from '../share/share';
import { SocialSharing } from '@ionic-native/social-sharing';
import { BackgroundMode } from '@ionic-native/background-mode';
import {SafeResourceUrl, DomSanitizer} from '@angular/platform-browser';

//By Rekar Dilzar Rashid Botany +9647504051800

@Component({
  selector: 'page-video',
  templateUrl: 'video.html',
})

export class Video {
  videos:any;
  tracks:any;
  playlist:boolean;
  tabBarElement:any;
  actions:any;
  opened:boolean=false;
  youtube:SafeResourceUrl;
  link:any;
  current:any;
  

  constructor(public md: MusicData, public sanitizer: DomSanitizer, public favorite:Favorite, public bg:BackgroundMode,public platform: Platform, public share: SocialSharing ,public actionSheetCtrl: ActionSheetController,public navCtrl: NavController, public navParams: NavParams,public musicservice:MusicService) {



this.videos=this.navParams.get('videos');
this.tracks=this.navParams.get('video');
this.current=this.videos.indexOf(this.tracks);
this.link="https://www.youtube.com/embed/"+this.tracks.video+"?autoplay=1";
console.log(this.link);
this.musicservice.uploadVideoAnalytics(this.tracks);
this.youtube=this.sanitizer.bypassSecurityTrustUrl(this.link);
console.log(this.youtube);
           platform.ready().then(() => {
       platform.registerBackButtonAction(() => {
         if(this.opened || this.favorite.islist || this.favorite.isnewlist){

              this.opened=false;
              this.favorite.islist=false;
              this.favorite.isnewlist=false;

setTimeout(() => {
   this.actions.dismiss();
   this.favorite.list.dismiss();
   this.favorite.newlist.dismiss();
}, 100);         }
            else if(this.navCtrl.canGoBack()){
              this.navCtrl.pop();
            }else{
              this.bg.moveToBackground();
            }
           
          });
    });
     this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
this.tabBarElement.style.display = 'none';
       
       this.playlist=false;

  }

back() {
                this.navCtrl.pop();

}
youtubeURL() {
    return this.sanitizer.bypassSecurityTrustUrl('https://www.youtube.com/embed/'+this.tracks.video+'?autoplay=1');

  }
  play(i){
    this.current=i;
    this.tracks=this.videos[i];
    this.link="https://www.youtube.com/embed/"+this.tracks.video+"?autoplay=1";
this.youtube=this.sanitizer.bypassSecurityTrustUrl(this.link);
this.musicservice.uploadVideoAnalytics(this.tracks);

  }

  

  next(){
    if(this.current==this.videos.length-1){
      this.play(0);
    }
    else if(this.current<this.videos.length-1){
      this.play(this.current+1);
    }
  }

  prev(){
    if(this.current==0){
      this.play(this.videos.length-1);
    }
    else if(this.current>0){
      this.play(this.current-1);
    }
  }

shareTrack(){

this.navCtrl.push(Share,{
  title:this.tracks.title,
  art:this.tracks.art,
  artist:this.tracks.artist,
  album:this.tracks.album

})


}

gotoartist(){
  this.navCtrl.push(Artist,{'artistKey':this.tracks.artistId});
}



 gotoalbum(){
    this.navCtrl.push(Album,{
  
      albumKey:this.tracks.albumId,
    artistKey:this.tracks.artistId    })
  }

action() {
   this.actions = this.actionSheetCtrl.create({
     title: this.tracks.title,
     buttons: [
       
       {
         text: 'Go to Music',
         handler: () => {
           this.opened=false;
this.musicservice.play(this.videos,this.current);
this.navCtrl.pop();
         }
       },
       {
         text: 'Go to Album',
         handler: () => {
           this.opened=false;
this.gotoalbum();
         }
       },
       {
         text: 'Go to Artist',
         handler: () => {
           this.opened=false;
           this.gotoartist();
         }
       },
       {
         text: 'Share',
         handler: () => {
           this.opened=false;

   this.shareTrack();
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


  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
        this.playlist=false;
        this.link="";

  }


  ngAfterContentInit() {     
    // get all tracks managed by AudioProvider so we can control playback via the APIs
    this.playlist=false;



  }
 ionViewWillEnter() {
       this.tabBarElement.style.display = 'none';

    this.playlist=false;
         
    
  }




togglePlaylist(){
  this.playlist=!this.playlist;
}








 swipePlay(event){
   if(event.direction==2){
     //this.musicservice.next();

   }
    if(event.direction==4){
     //this.musicservice.prev();

   }
 }

}




