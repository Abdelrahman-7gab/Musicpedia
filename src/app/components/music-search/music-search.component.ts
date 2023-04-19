import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-music-search',
  templateUrl: './music-search.component.html',
  styleUrls: ['./music-search.component.scss'],
})
export class MusicSearchComponent implements OnInit {
  searchParam:string = "track";

  constructor() {}

  ngOnInit(): void {}

  AorAn(word: string): string {
    if (
      word.charAt(0) !== 'a' &&
      word.charAt(0) !== 'o' &&
      word.charAt(0) !== 'u' &&
      word.charAt(0) !== 'u' &&
      word.charAt(0) !== 'i'
    )
      return 'a ' + word;

     return 'an ' + word;
  }

  setSearchParam(param:string):void{
    this.searchParam = param;
  }
  
  startSearch(word:string):void{
    if(word.trim() != "")
    console.log(word.trim());
  }

}
