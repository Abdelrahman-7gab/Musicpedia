import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { createSelector, Store } from '@ngrx/store';
import { ICard } from 'src/app/services/Imusic';
import { featureSelector } from 'src/app/state/playingAudio/playingAudio.store';

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
  activeAudioUUid$ = this.store.select(createSelector(featureSelector, (state) => state.uuid));

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private store: Store<any>
  ) {}

  ngOnInit(): void {
    this.cardType = this.result.type;
    this.activeAudioUUid$.subscribe((uuid) => {
      this.setActive(uuid == this.uuid);
    });
  }

  setActive(bool: boolean) {
    this.active = bool;
    this.changeDetectorRef.detectChanges();
  }

  setUuid(uuid: string) {
    this.uuid = uuid;
  }
}
