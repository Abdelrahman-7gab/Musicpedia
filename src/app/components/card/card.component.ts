import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import { ITrack,IArtist,IAlbum } from 'src/app/services/Imusic';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() result:any;
  cardType:string = '';
  @Output() audioIsPlaying = new EventEmitter<string>();
  @Input() playingAudio:string = "";

  constructor() { }

  ngOnInit(): void {
    this.cardType = this.result.type;
  }

}
