import { Injectable } from '@angular/core';
import { Router,ActivatedRoute  } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { getSearchResults } from '../state/searchResults/searchResults.store';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  public searchBarValue:string = "";
  public searchBarType:BehaviorSubject<string> =new BehaviorSubject<string>("track");

  constructor(private router:Router, private store:Store,private route:ActivatedRoute) { 

      this.route.queryParams.subscribe(async (params) => {
      let searchQuery = params['q'];
      let searchType = params['t'] || 'track';
      
      this.searchBarValue =searchQuery;
      this.searchBarType.next(searchType);

      if (searchQuery != null) this.getSearchResults(searchType,searchQuery);
    });

  }

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
