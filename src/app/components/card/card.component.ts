import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import {  Store } from '@ngrx/store';
import { ICard } from 'src/app/services/Imusic';
import { UUIDSelector } from 'src/app/state/playingAudio/playingAudio.store';
import { Router } from '@angular/router';
import { changeSong,getLyrics } from 'src/app/state/trackPage/trackpage.store';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input()
  result: ICard = {id:-1,type:"null"};
  cardType: string = '';
  active: boolean = false;
  uuid: string = 'default';
  activeAudioUUid$ = this.store.select(UUIDSelector);

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private store: Store<any>,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.cardType = this.result.type;
    this.activeAudioUUid$.subscribe((uuid) => {
    this.setActive(uuid == this.uuid);
    });
  }

  setActive(bool: boolean):void {
    this.active = bool;
    this.changeDetectorRef.detectChanges();
  }

  setUuid(uuid: string):void {
    this.uuid = uuid;
  }

  cardClick():void{
    if(this.cardType=="track"){
    this.router.navigateByUrl(`/track?id=${this.result.id}`);
    this.store.dispatch(changeSong({song:this.result}));
    this.store.dispatch(getLyrics({artist:this.result.artistName,title:this.result.trackTitle}));
    }
  }
}
