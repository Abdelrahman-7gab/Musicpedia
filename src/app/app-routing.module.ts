import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { MusicSearchComponent } from './components/music-search/music-search.component';

const routes: Routes = [{path:'',component : HomePageComponent},{path:'music', component :MusicSearchComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
