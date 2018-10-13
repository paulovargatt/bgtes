import { NgModule, ModuleWithProviders } from '@angular/core';
import { MusicService } from '../../providers/musicservice';
import { Favorite } from '../../providers/favorite';
import { MusicData } from '../../providers/music-data';
import { MusicControls } from '@ionic-native/music-controls';
import { Offline } from '../../providers/offline';


@NgModule({})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [MusicService,Favorite,MusicData,MusicControls]
    };
  }
}

//By Rekar Dilzar Rashid Botany +9647504051800
