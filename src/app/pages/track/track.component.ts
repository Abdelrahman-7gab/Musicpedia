import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectLyrics,
  selectSong,
} from 'src/app/state/metadata/metadata.store';
import { ActivatedRoute } from '@angular/router';
import { ViewService } from 'src/app/services/view.service';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.scss'],
})
export class TrackComponent implements OnInit {
  lyrics$ = this.store.select(selectLyrics);
  song$ = this.store.select(selectSong);

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private viewService: ViewService
  ) {}

  ngOnInit(): void {}

  getLyrics(artist: string, title: string): void {
    this.viewService.getLyrics(artist, title);
  }
}
