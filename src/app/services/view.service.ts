import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  getAlbums,
  getItem,
  getLyrics,
  selectItem,
  selectStatus,
} from '../state/metadata/metadata.store';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ViewService {
  currentID: number = -1;
  currentType: string = '';
  currentStatus: string = '';

  item$ = this.store.select(selectItem);
  status$ = this.store.select(selectStatus);

  constructor(
    private route: ActivatedRoute,
    private store: Store<any>,
    private router: Router
  ) {
    //check for id changes in the URL link to call the get song api
    this.route.queryParams.subscribe(async (params) => {
      let id = params['id'];
      let type = params['type'];
      if (
        (id != null && this.currentID != id) ||
        (type != null && this.currentType != type)
      ) {
        this.store.dispatch(getItem({ itemType: type, id: id }));
      }
    });

    this.status$.subscribe((status) => {
      this.currentStatus = status;
    });

    this.item$.subscribe((item) => {
      if (item != null) {
        this.currentType = item.type;
        this.currentID = item.id;
        //get current song and get lyrics for it
        if (
          item.type == 'track' &&
          item.artistName != null &&
          item.trackTitle != null
        )
          this.store.dispatch(
            getLyrics({ artist: item.artistName, title: item.trackTitle })
          );

        //if the album only has 1 song go to track page
        if (item.type == 'album' && item.tracks!.length == 1) {
          this.router.navigateByUrl(
            `track?id=${item.tracks![0].id}&type=track`,
            { replaceUrl: true }
          );
        }

        //if the item is an artist get his albums list
        if (
          item.type == 'artist' &&
          this.currentStatus != 'loadedAlbums' &&
          this.currentStatus != 'loadingAlbums'
        ) {
          this.store.dispatch(getAlbums({ artistID: item.id }));
        }
      }
    });
  }

  getLyrics(artist: string, title: string): void {
    this.store.dispatch(getLyrics({ artist, title }));
  }
}
