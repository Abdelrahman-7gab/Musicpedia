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
import { SearchResultsPageComponent } from './components/search-results-page/search-results-page.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    MusicSearchComponent,
    NavbarComponent,
    HomePageComponent,
    FooterComponent,
    SearchResultsPageComponent,
  ],
  imports: [HttpClientModule,BrowserModule, AppRoutingModule, BrowserAnimationsModule,FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
