import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-search-results-page',
  templateUrl: './search-results-page.component.html',
  styleUrls: ['./search-results-page.component.scss']
})
export class SearchResultsPageComponent implements OnInit {
  playingAudio:string = "";
  searchResults:BehaviorSubject<any> = new BehaviorSubject<any>({});

  constructor(private searchService:SearchService) { }

  ngOnInit(): void {
    this.searchResults = this.searchService.getResults();
  }

  changePlayingSound(uuid:string){
    this.playingAudio = uuid;
  }

}
