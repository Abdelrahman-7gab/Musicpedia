import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  searchParam:string = "track";
  query:string = "";
  viewType:string = "";
  viewQuery:string = "";  

  constructor(private router:Router) { }

  startSearch(word:string):void{
    let trimmedWord = word.trim();
    if(trimmedWord != ""){
      this.query = trimmedWord;
      this.router.navigateByUrl(`music?p=${this.searchParam}&q=${this.query}`);
    }
  }
}
