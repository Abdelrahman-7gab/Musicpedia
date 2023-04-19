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
    this.route.queryParams.subscribe(async (params) => {
      let id = params['id'];
      if (id != null && this.currentID != id) {
        console.log('id', id, 'currentID', this.currentID);
        this.store.dispatch(getItem({ itemType: 'track', id: id }));
      }
    });

    this.song$.subscribe((song) => {
      if (song != null) {
        this.currentID = song.id;
        if (song != null)
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
