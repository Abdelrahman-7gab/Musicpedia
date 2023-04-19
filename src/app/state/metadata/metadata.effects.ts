import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, of } from 'rxjs';
import {
  getLyrics,
  changeLyrics,
  getLyricsFail,
  changeItemMetadata,
  getItem,
  getItemFail,
  getAlbums,
  getAlbumsFail,
  changeAlbums,
} from './metadata.store';
import { switchMap } from 'rxjs';
import { ILyrics } from 'src/app/services/Imusic';
import { mapToICard } from 'src/app/services/Imusic';
import { fetch } from '@tauri-apps/api/http';
import { from } from 'rxjs';

@Injectable()
export class metadataEffects {
  // results$ = Observable</TrackAPI>

  lyricsEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(getLyrics),
      switchMap(({ payload }) =>
        from(
          fetch(
            `http://musicpedia.live/api/lyrics/${payload.artist}/${payload.title}`
          )
        )
          .pipe(map((response) => response.data))
          .pipe(
            map((data) => changeLyrics({ lyrics: (data as ILyrics).lyrics })),

            catchError((error) => of(getLyricsFail({ error: error })))
          )
      )
    )
  );

  getSongEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(getItem),
      switchMap(({ payload }) =>
        from(fetch(`https://api.deezer.com/${payload.itemType}/${payload.id}`))
          .pipe(map((response) => response.data))
          .pipe(
            map((data) => changeItemMetadata({ item: mapToICard(data) })),

            catchError((error) => of(getItemFail({ error: error })))
          )
      )
    )
  );

  albumsEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(getAlbums),
      switchMap(({ payload }) =>
        from(fetch(`https://api.deezer.com/artist/${payload.artistID}/albums`))
          .pipe(map((response) => response.data))
          .pipe(
            map((res) =>
              changeAlbums({ albums: (res as any).data.map(mapToICard) })
            ),

            catchError((error) => of(getAlbumsFail({ error: error })))
          )
      )
    )
  );

  constructor(private http: HttpClient, private actions$: Actions) {}
}
