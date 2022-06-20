import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {  Store } from '@ngrx/store';
import { ICard } from 'src/app/services/Imusic';
import { UUIDSelector } from 'src/app/state/playingAudio/playingAudio.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit, OnChanges {
  @Input()
  result: ICard | null= null;
  cardType: string = '';
  active: boolean = false;
  uuid: string = 'default';
  activeAudioUUid$ = this.store.select(UUIDSelector);

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private store: Store<any>,
    private router:Router
  ) {}

  ngOnChanges(changes: SimpleChanges): void
  {
    if(changes['result'].currentValue != null)
    this.cardType = this.result!.type;
  }

  ngOnInit(): void {
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
    if(this.cardType=="track" && this.result != null){
    this.router.navigateByUrl(`/track?id=${this.result.id}`);
    }
  }
}
