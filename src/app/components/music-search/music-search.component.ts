import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';
@Component({
  selector: 'app-music-search',
  templateUrl: './music-search.component.html',
  styleUrls: ['./music-search.component.scss'],
})
export class MusicSearchComponent implements OnInit {
  searchType:string = "track";
  constructor(public searchService: SearchService) {}



  ngOnInit(): void {

    this.searchService.searchBarType.subscribe((type) => {
      this.searchType = type;
    });
    
  }

  AorAn(word: string): string {
    const firstLetter = word.charAt(0)
    if (
      firstLetter !== 'a' &&
      firstLetter !== 'o' &&
      firstLetter !== 'u' &&
      firstLetter !== 'e' &&
      firstLetter !== 'i'
    )
      return 'a ' + word;

    return 'an ' + word;
  }

  startSearch(word: string): void {
    this.searchService.startSearch(word,this.searchType);
  }
}
