import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
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
import { IAlbum, ILyrics, ITrack } from 'src/app/services/Imusic';
import { mapToICard } from 'src/app/services/Imusic';

@Injectable()
export class metadataEffects {
  // results$ = Observable</TrackAPI>

  lyricsEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(getLyrics),
      switchMap(({ payload }) =>
        this.http
          .get<ILyrics>(
            `${environment.lyricsURL}/${payload.artist}/${payload.title}`
          )
          .pipe(
            map((data) => changeLyrics({ lyrics: data.lyrics })),

            catchError((error) => of(getLyricsFail({ error: error })))
          )
      )
    )
  );

  getSongEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(getItem),
      switchMap(({ payload }) =>
        this.http
          .get<ITrack>(
            `${environment.serverUrl}/view/${payload.itemType}/${payload.id}`
          )
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
        this.http
          .get<any>(`${environment.serverUrl}/albums/${payload.artistID}`)
          .pipe(
            map((res) => changeAlbums({ albums: res.data.map(mapToICard) })),

            catchError((error) => of(getAlbumsFail({ error: error })))
          )
      )
    )
  );

  constructor(private http: HttpClient, private actions$: Actions) {}
}
