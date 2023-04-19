import { Injectable } from '@angular/core';
import { Router  } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { TrackAPI,IArtist,ITrack,IAlbum } from './Imusic';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private searchResults:BehaviorSubject<any> = new BehaviorSubject<any>({});
  serverUrl:string = "http://localhost:3000";

  constructor(private router:Router, private http:HttpClient) { }

  startSearch(word:string,searchType:string):void{
    let query = word.trim();
    if(query != ""){
      let currentPage = this.router.url.substring(1,7);
      if(currentPage != "search")
      this.router.navigateByUrl(`search?t=${searchType}&q=${query}`);
      else
      this.getSearchResults(searchType,query);
    }
  }

  async getSearchResults(searchType:string,query:string):Promise<void>{
       const result:TrackAPI = await lastValueFrom(this.http.get<TrackAPI>(`${this.serverUrl}/search/${searchType}/${query}`));
       this.searchResults.next(result);
       console.log(result)
  }

  public getResults():BehaviorSubject<any>{
    return this.searchResults;
  } 
}
