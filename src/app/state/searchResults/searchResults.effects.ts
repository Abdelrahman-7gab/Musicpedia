import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, of } from 'rxjs';
import { TrackAPI } from 'src/app/services/Imusic';
import {
  getSearchResults,
  failedSearch,
  changeSearchResults,
} from './searchResults.store';
import { switchMap } from 'rxjs';
import { mapToICard } from 'src/app/services/Imusic';
import { fetch } from '@tauri-apps/api/http';
import { from } from 'rxjs';

@Injectable()
export class searchEffects {
  // results$ = Observable</TrackAPI>

  searchEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(getSearchResults),
      switchMap(({ payload }) =>
        from(
          fetch(
            `https://api.deezer.com/search/${payload.queryType}?q=${payload.query}`
          )
        )
          .pipe(map((response) => response.data))
          .pipe(
            map((results) =>
              changeSearchResults({
                results: {
                  ...(results as TrackAPI),
                  data: (results as TrackAPI).data.map(mapToICard),
                },
              })
            ),

            catchError((error) => of(failedSearch({ error: error })))
          )
      )
    )
  );
  constructor(private actions$: Actions) {}
}
