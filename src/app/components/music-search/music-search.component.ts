import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';
@Component({
  selector: 'app-music-search',
  templateUrl: './music-search.component.html',
  styleUrls: ['./music-search.component.scss'],
})
export class MusicSearchComponent implements OnInit {
  constructor(public searchService: SearchService) {}

  ngOnInit(): void {}

  AorAn(word: string): string {
    if (
      word.charAt(0) !== 'a' &&
      word.charAt(0) !== 'o' &&
      word.charAt(0) !== 'u' &&
      word.charAt(0) !== 'e' &&
      word.charAt(0) !== 'i'
    )
      return 'a ' + word;

    return 'an ' + word;
  }

  setSearchParam(param: string): void {
    this.searchService.searchType = param;
  }

  startSearch(word: string): void {
    this.searchService.startSearch(word);
  }
}
