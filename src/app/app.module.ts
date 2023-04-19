import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MusicSearchComponent } from './components/music-search/music-search.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { SearchResultsPageComponent } from './pages/search-results-page/search-results-page.component';
import { HttpClientModule } from '@angular/common/http';
import { CardComponent } from './components/card/card.component';
import { RecordingPlayerComponent } from './components/recording-player/recording-player.component';
import { NgxFitTextModule } from '@pikselin/ngx-fittext';

@NgModule({
  declarations: [
    AppComponent,
    MusicSearchComponent,
    NavbarComponent,
    HomePageComponent,
    FooterComponent,
    SearchResultsPageComponent,
    CardComponent,
    RecordingPlayerComponent,
  ],
  imports: [HttpClientModule,BrowserModule, AppRoutingModule, BrowserAnimationsModule,FormsModule,NgxFitTextModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
