import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from './services/search.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Musicpedia';

  constructor(private route:ActivatedRoute, public searchService:SearchService){

    console.log(this.route);

    this.route.queryParams.subscribe(async (params) => {
      let searchParam = params['p'];
      let query = params['q'];
      let viewType = params['t'];
      let viewQuery = params['vq'];

      if(searchParam != null)
      this.searchService.searchParam = searchParam;
      if(query != null)
      this.searchService.query = query;
      if(viewType != null)
      this.searchService.viewType = viewType;
      if(viewQuery != null)
      this.searchService.viewQuery = viewQuery;

      

    })

  }
}
