import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Musicpedia';
  showNavbar: boolean = true;

  constructor(private location: Location) {
    if (
      this.location.path() === '' ||
      this.location.path().charAt(0) == '?'
    ) {
      this.showNavbar = false;
    }

    this.location.onUrlChange((url) => {
      if (url == '/' || url.substring(0, 2) == '/?') 
        this.showNavbar = false;
      else
        this.showNavbar = true;
      
    });
  }
}
