import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { BackgroundMode } from '@ionic-native/background-mode';

//By Rekar Dilzar Rashid Botany +9647504051800

@Component({
  selector: 'page-share',
  templateUrl: 'share.html',
})
export class Share {
title:any;
art:string;
subtitle:any;
link:any;
  tabBarElement:any;
  text:string;
  artist:any;
  sms:string;
  pic:string;

  constructor(public bg:BackgroundMode,public platform: Platform, public sh: SocialSharing , public navParams: NavParams,public navCtrl:NavController) {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
this.tabBarElement.style.display = 'none';
    this.title=this.navParams.get("title");
    this.artist=this.navParams.get("artist");
    this.art = this.navParams.get("art");
    this.pic="";
    
    this.link="http://fasttv.vintv.net/awazaImage/awaza.php?artist="+this.navParams.get("artist")+"&song="+this.navParams.get("title")+"&album="+this.navParams.get("album");
    this.link=encodeURI(this.link);
    this.text='#Awaza';
    this.sms="#NowPlaying " + this.title + " by " + this.artist + " on Awaza";

    
platform.ready().then(() => {
       platform.registerBackButtonAction(() => {
            if(this.navCtrl.canGoBack()){
              this.navCtrl.pop();
            }else{
              this.bg.moveToBackground();
            }
           
          });
    });

  }







  ionViewDidLoad() {

  }

    ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';}


     ionViewWillEnter() {
     this.tabBarElement.style.display = 'none';}
  
  share(){
      /* this.sh.share(this.text ,'', 'http://fasttv.vintv.net/icon2.png',this.link)
         .then((data) =>
         {
            console.log('Shared via SharePicker');
         })
         .catch((err) =>
         {
            console.log('Was not shared via SharePicker');
         });*/
  }


  sharefb(art){
    //this.sh.shareViaFacebook(this.text,this.pic,this.link);
  }

  shareig(art){
    //this.sh.shareViaInstagram(this.text,'http://fasttv.vintv.net/icon2.png');
  }

  sharewa(art){
    //this.sh.shareViaWhatsApp(this.sms,'http://fasttv.vintv.net/icon2.png',this.link);
  }

  sharesms(){
    //this.sh.shareViaSMS(this.sms,null);
  }

  shareem(){
    //this.sh.shareViaEmail(this.sms,'Awaza',null,null,this.link,'http://www.fasttv.vintv.net/icon2.png');
  }

}
