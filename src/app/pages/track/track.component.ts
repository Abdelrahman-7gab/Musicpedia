import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectLyrics,
  selectItem,
  selectStatus,
} from 'src/app/state/metadata/metadata.store';
import { ViewService } from 'src/app/services/view.service';
import { ICard } from 'src/app/services/Imusic';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.scss'],
})
export class TrackComponent implements OnInit {
  lyrics$ = this.store.select(selectLyrics);
  song$ = this.store.select(selectItem);
  status$ = this.store.select(selectStatus);
  
  constructor(
    private store: Store,
    private viewService: ViewService
  ) {}

  ngOnInit(): void {
  }

  getLyrics(artist: string, title: string): void {
    this.viewService.getLyrics(artist, title);
  }
}
