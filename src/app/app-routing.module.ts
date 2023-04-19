import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlbumComponent } from './pages/album/album.component';
import { ArtistComponent } from './pages/artist/artist.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { SearchResultsPageComponent } from './pages/search-results-page/search-results-page.component';
import { TrackComponent } from './pages/track/track.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'search', component: SearchResultsPageComponent },
  { path: 'track', component: TrackComponent },
  { path: 'album', component: AlbumComponent },
  { path: 'artist', component: ArtistComponent },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
