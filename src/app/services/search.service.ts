import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { TrackAPI,IArtist,ITrack,IAlbum } from './Imusic';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  searchResults:Array<any> = [];
  serverUrl:string = "http://localhost:3000";

  constructor(private router:Router, private http:HttpClient) { }

  startSearch(word:string,searchType:string):void{
    let query = word.trim();
    if(query != ""){
      this.router.navigateByUrl(`search?t=${searchType}&q=${query}`);
    }
  }

  async getSearchResults(searchType:string,query:string):Promise<void>{
       const result:TrackAPI = await lastValueFrom(this.http.get<TrackAPI>(`${this.serverUrl}/search/${searchType}/${query}`));
       this.searchResults = result.data;
       console.log(result)
  }
}
