import { Component, OnInit } from '@angular/core';
import { ICard } from 'src/app/services/Imusic';
import { Store } from '@ngrx/store';
import { selectItem } from 'src/app/state/metadata/metadata.store';
import { ViewService } from 'src/app/services/view.service';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss']
})
export class AlbumComponent implements OnInit {
  album$ = this.store.select(selectItem);
  constructor(private store:Store<any>, private viewService:ViewService) { }

  ngOnInit(): void {
  }

  getTrackList(){
  }

}
