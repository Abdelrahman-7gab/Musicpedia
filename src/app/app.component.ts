import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from './services/search.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Musicpedia';

  constructor(
    private route: ActivatedRoute,
    public searchService: SearchService
  ) {
    this.route.queryParams.subscribe(async (params) => {
      let searchQuery = params['q'];

      let searchType = params['t'] || 'track';

      if (searchQuery != null) this.searchService.getSearchResults(searchType,searchQuery);
    });
  }
}
