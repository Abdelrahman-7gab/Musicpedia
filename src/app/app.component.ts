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
      const searchQuery = params['sq'];

      this.searchService.searchType = params['st'] || 'track';
      this.searchService.query = searchQuery || '';
      this.searchService.viewType = params['vt'] || '';
      this.searchService.viewQuery = params['vq'] || '';

      if (searchQuery != null) this.searchService.getSearchResults();
    });
  }
}
