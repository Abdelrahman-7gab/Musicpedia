import { Injectable } from '@angular/core';
import { Router  } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { getSearchResults } from '../state/searchResults/searchResults.actions';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  serverUrl:string = "http://localhost:3000";
  public searchBarValue:string = "";
  public searchBarType:BehaviorSubject<string> =new BehaviorSubject<string>("track");

  constructor(private router:Router, private store:Store) { }

  startSearch(word:string,searchType:string):void{
    let query = word.trim();
    if(query != ""){
      this.router.navigateByUrl(`search?t=${searchType}&q=${query}`);
    }
  }

  async getSearchResults(searchType:string,query:string):Promise<void>{
      this.store.dispatch(getSearchResults({query:query,queryType:searchType}));
  }

}
