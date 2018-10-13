import { Injectable, Pipe } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
/*
  Generated class for the Youtube pipe.
  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
@Pipe({
  name: 'safe'
})
@Injectable()
export class Safe {

  constructor(private domSanitizer: DomSanitizer){}

  transform(value, args) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(value);
  }
}