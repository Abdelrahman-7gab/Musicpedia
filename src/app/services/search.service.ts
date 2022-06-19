import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { getSearchResults } from '../state/searchResults/searchResults.store';
import { selectSong } from '../state/metadata/metadata.store';
import { ICard } from './Imusic';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  public searchBarValue: string = '';
  public searchBarType: BehaviorSubject<string> = new BehaviorSubject<string>(
    'track'
  );

  private currentStoreSong: ICard = { id: -1, type: 'null' };

  private lastSearchType: string = '';
  private lastQuery: string = '';

  constructor(
    private router: Router,
    private store: Store,
    private route: ActivatedRoute
  ) {
    //check for type or query changes in the URL link to call the get search results api
    this.route.queryParams.subscribe(async (params) => {
      let searchQuery = params['q'];
      let searchType = params['t'] || 'track';

      this.searchBarValue = searchQuery;
      this.searchBarType.next(searchType);

      if (searchQuery != null) this.getSearchResults(searchType, searchQuery);

      this.store.select(selectSong).subscribe((song) => {
        this.currentStoreSong = song;
      });
    });
  }

  //changes the url to the search page with the current search bar value to generate unique url for each search.
  startSearch(word: string, searchType: string): void {
    let query = word.trim();
    if (query != '') {
      this.router.navigateByUrl(`search?t=${searchType}&q=${query}`);
    }
  }

  async getSearchResults(searchType: string, query: string): Promise<void> {
    if (searchType != this.lastSearchType || query != this.lastQuery) {
      this.lastSearchType = searchType;
      this.lastQuery = query;
      this.store.dispatch(
        getSearchResults({ query: query, queryType: searchType })
      );
    }
  }

  //to avoid calling the api for the same song twice, we check if the song is the same as the one in the store.
  showLatestSearch(): void {
    if (this.lastQuery == '') {
      let title = this.currentStoreSong.trackTitle;

      if (this.currentStoreSong.type == 'album')
        title = this.currentStoreSong.albumTitle;
      else if (this.currentStoreSong.type == 'artist')
        title = this.currentStoreSong.artistName;

      this.router.navigateByUrl(
        `search?t=${this.currentStoreSong.type}&q=${title}`
      );
    } else
      this.router.navigateByUrl(
        `search?t=${this.lastSearchType}&q=${this.lastQuery}`
      );
  }

}
