import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-search-results-page',
  templateUrl: './search-results-page.component.html',
  styleUrls: ['./search-results-page.component.scss']
})
export class SearchResultsPageComponent implements OnInit {

  constructor(public searchService:SearchService) { }

  ngOnInit(): void {
  }

}
