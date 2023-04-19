import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MusicSearchComponent } from './components/music-search/music-search.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    MusicSearchComponent,
    NavbarComponent,
    HomePageComponent,
    FooterComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule,FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
