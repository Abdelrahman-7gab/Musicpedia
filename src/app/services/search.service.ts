import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { TrackAPI } from './Imusic';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  searchType:string = "";
  query:string = "";
  viewType:string = "";
  viewQuery:string = "";
  searchResults:any;
  
  serverUrl:string = "http://localhost:3000";

  constructor(private router:Router, private http:HttpClient) { }

  startSearch(word:string):void{
    let trimmedWord = word.trim();
    if(trimmedWord != ""){
      this.query = trimmedWord;
      this.router.navigateByUrl(`search?st=${this.searchType}&sq=${this.query}`);
      this.getSearchResults();
    }
  }

  async getSearchResults():Promise<void>{
       const result:any = await lastValueFrom(this.http.get(`${this.serverUrl}/search/${this.searchType}/${this.query}`));
       this.searchResults = result.data;
  }
}
