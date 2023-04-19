import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectItem } from 'src/app/state/metadata/metadata.store';
import { ViewService } from 'src/app/services/view.service';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.scss']
})
export class ArtistComponent implements OnInit {
  artist$ = this.store.select(selectItem);
  constructor(private store:Store<any>, private viewService:ViewService) { }

  ngOnInit(): void {
  }

}
