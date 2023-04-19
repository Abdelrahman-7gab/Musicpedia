import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectResults } from 'src/app/state/searchResults/searchResults.store';

@Component({
  selector: 'app-search-results-page',
  templateUrl: './search-results-page.component.html',
  styleUrls: ['./search-results-page.component.scss']
})
export class SearchResultsPageComponent implements OnInit {
  playingAudio:string = "";
  searchResults$ = this.store.select(selectResults);

  constructor(private store:Store<any>) { }

  ngOnInit(): void {
  }

  changePlayingSound(uuid:string){
    this.playingAudio = uuid;
  }

}
