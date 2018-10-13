import {
  Injectable,
  Input,
  Inject
} from '@angular/core';
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
declare var cordova: any;

/*
  Generated class for the OfflineProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Offline {
  storageDirectory:string = '';

  constructor( public filePath:FilePath,public alertCtrl:AlertController,public transfer: FileTransfer, public file: File,public storage:Storage, public platform: Platform) {


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





  download(file,name) {
console.log(file + " : " + name);
    this.platform.ready().then(() => {

      const fileTransfer: FileTransferObject = this.transfer.create();
      const imageLocation = file;
      fileTransfer.download(imageLocation, this.storageDirectory + name).then((entry) => {
          console.log(entry);
          console.log(entry.toURL());
        

      }, (error) => {
console.log(error);
       

      });

    });

  }

  retrieve(name):any {

    
    this.file.checkFile(this.storageDirectory, name)
      .then(x => {
        this.file.readAsDataURL
const path =this.storageDirectory + name.replace(/ /g, '%20');
        console.log(" offline : "+path);
        
        return path.toString();

      })
      .catch((err) => {
console.log(err);
return false;

        

        

      });
  }


}
