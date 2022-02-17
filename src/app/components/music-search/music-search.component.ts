import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-music-search',
  templateUrl: './music-search.component.html',
  styleUrls: ['./music-search.component.scss']
})
export class MusicSearchComponent implements OnInit {

  searchResults:any = ["potato","tomato"];

  constructor() { }

  ngOnInit(): void {
  }

}
