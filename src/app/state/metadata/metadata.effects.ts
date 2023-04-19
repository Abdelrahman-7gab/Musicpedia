import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError,of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { getLyrics,changeLyrics,getLyricsFail, changeItemMetadata, getItem,getItemFail } from './metadata.store';
import { switchMap } from 'rxjs';
import { ILyrics, ITrack } from 'src/app/services/Imusic';
import { mapToICard } from 'src/app/services/Imusic';

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

 getSongEffect = createEffect(
    () =>
      this.actions$.pipe(
        ofType(getItem),
        switchMap(({ payload }) =>
            this.http.get<ITrack>(
                `${environment.serverUrl}/view/${payload.itemType}/${payload.id}`
            ).pipe(map((data) => changeItemMetadata({ [data.type]: mapToICard(data) })),
            
            catchError((error) => of(getItemFail({error:error}))))  ,
        
        )
      ),
  );


  constructor(private http: HttpClient, private actions$: Actions) {}
}
