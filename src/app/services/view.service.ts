import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  getItem,
  getLyrics,
  selectSong,
} from '../state/metadata/metadata.store';

@Injectable({
  providedIn: 'root',
})
export class ViewService {
  currentID: number = -1;
  song$ = this.store.select(selectSong);

  constructor(private route: ActivatedRoute, private store: Store<any>) {
    //check for id changes in the URL link to call the get song api
    this.route.queryParams.subscribe(async (params) => {
      let id = params['id'];
      if (id != null && this.currentID != id) {
        this.store.dispatch(getItem({ itemType: 'track', id: id }));
      }
    });

    //get current song and get lurics for it.
    this.song$.subscribe((song) => {
      if (song != null) {
        this.currentID = song.id;
        if (song.artistName != null && song.trackTitle != null) 
          this.store.dispatch(
            getLyrics({ artist: song.artistName, title: song.trackTitle })
          );
      }
    });
  }

  getLyrics(artist: string, title: string): void {
    this.store.dispatch(getLyrics({ artist, title }));
  }
}
