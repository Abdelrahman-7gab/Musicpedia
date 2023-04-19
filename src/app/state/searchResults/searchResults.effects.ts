import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError,of } from 'rxjs';
import { ICard, TrackAPI } from 'src/app/services/Imusic';
import { environment } from 'src/environments/environment';
import { getSearchResults,failedSearch,changeSearchResults } from './searchResults.store';
import { switchMap } from 'rxjs';
import { mapToICard } from 'src/app/services/Imusic';

@Injectable()
export class searchEffects {
  // results$ = Observable</TrackAPI>

  searchEffect = createEffect(
    () =>
      this.actions$.pipe(
        ofType(getSearchResults),
        switchMap(({ payload }) =>
            this.http.get<TrackAPI>(
                `${environment.serverUrl}/search/${payload.queryType}/${payload.query}`
            ).pipe(map((results) => changeSearchResults({results:{...results, data : results.data.map(mapToICard)}})),
            
            catchError((error) => of(failedSearch({error:error})))),
        
        )
      ),
  );
  constructor(private http: HttpClient, private actions$: Actions) {}
}
