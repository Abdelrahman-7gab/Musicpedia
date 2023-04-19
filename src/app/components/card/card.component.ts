import { Component, OnInit,Input, Output, EventEmitter,ChangeDetectorRef } from '@angular/core';

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
  active:boolean = false;

  constructor(private changeDetectorRef:ChangeDetectorRef) { }

  ngOnInit(): void {
    this.cardType = this.result.type;
  }

  setActive(bool:boolean){
    this.active = bool;
    this.changeDetectorRef.detectChanges();
  }

  playAudio(uuid:string){
    this.audioIsPlaying.emit(uuid);
    this.setActive(true);
  }

}
