import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getLyrics,selectLyrics } from 'src/app/state/trackPage/trackpage.store';
import {ActivatedRoute} from '@angular/router';
import { ICard } from 'src/app/services/Imusic';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.scss']
})
export class TrackComponent implements OnInit {
  lyrics$ = this.store.select(selectLyrics);
  song:ICard = {id:-1,type:"null"};

  constructor(private store:Store,private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.lyrics$.subscribe((lyrics)=>{
      console.log(lyrics);
    });
    
    this.route.queryParams.subscribe(async (params) => {
      let id = params['id'];
      // if(this.song.id != id)
      // this.store.dispatch(getSong);
    });

  }


  getLyrics(artist:string, title:string):void{
   this.store.dispatch(getLyrics({artist,title}));
  }
}
