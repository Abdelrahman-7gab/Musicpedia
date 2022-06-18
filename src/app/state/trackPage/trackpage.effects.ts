import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError,of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { getLyrics,changeLyrics,getLyricsFail, getSong } from './trackpage.store';
import { switchMap } from 'rxjs';
import { ILyrics } from 'src/app/services/Imusic';

@Injectable()
export class trackPageEffects {
  // results$ = Observable</TrackAPI>

  searchEffect = createEffect(
    () =>
      this.actions$.pipe(
        ofType(getLyrics),
        switchMap(({ payload }) =>
            this.http.get<ILyrics>(
                `${environment.lyricsURL}/${payload.artist}/${payload.title}`
            ).pipe(map((data) => changeLyrics({ lyrics: data.lyrics })),
            
            catchError((error) => of(getLyricsFail({error:error}))))  ,
        
        )
      ),
  );

 getSongWithLyricsEffect = createEffect(
    () =>
      this.actions$.pipe(
        ofType(getSong),
        switchMap(({ payload }) =>
            this.http.get<ILyrics>(
                `${environment.lyricsURL}/${payload.artist}/${payload.title}`
            ).pipe(map((data) => changeLyrics({ lyrics: data.lyrics })),
            
            catchError((error) => of(getLyricsFail({error:error}))))  ,
        
        )
      ),
  );


  constructor(private http: HttpClient, private actions$: Actions) {}
}
