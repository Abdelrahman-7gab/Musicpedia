import { Component, Input,Output, EventEmitter, AfterViewInit,ChangeDetectorRef, OnChanges, SimpleChanges  } from "@angular/core";
import WaveSurfer from "wavesurfer.js";
import { v4 as uuidv4 } from "uuid";
import { Subject } from "rxjs";
import { throttleTime } from "rxjs/operators";
import { createSelector, Store } from "@ngrx/store";
import { changePlayingSound,stopPlayingSound,UUIDSelector } from "src/app/state/playingAudio/playingAudio.store";

@Component({
  selector: "app-recording-player",
  templateUrl: "./recording-player.component.html",
  styleUrls: ["./recording-player.component.scss"],
})
export class RecordingPlayerComponent implements AfterViewInit,OnChanges {
  @Input() audioLink: string | undefined = "";
  @Output() uuidEmitter: EventEmitter<string> = new EventEmitter();
  wave: any = null;
  uuid: string;
  readyToPlay:boolean = false;
  activeAudioUUid$ = this.store.select(UUIDSelector);

  isPlaying: boolean = false;
  audioLength = new Subject<string>();
  currentLength: string = "0:00";

  constructor(private changeDetectorRef:ChangeDetectorRef,private store:Store<any>) {
    this.uuid = "n" + uuidv4();
  }
  ngOnChanges(changes: SimpleChanges): void
  {
    if(changes["audioLink"].currentValue != changes["audioLink"].previousValue && this.wave != null)
    {
      this.wave.load(this.audioLink);
    }
  }

  ngAfterViewInit() {
    this.audioLength.pipe(throttleTime(100)).subscribe((t) => {
      this.currentLength = t;
      this.changeDetectorRef.detectChanges();
    });

      this.generateWaveform();

      this.activeAudioUUid$.subscribe((uuid) => {
        this.pauseIfOtherIsPlaying(uuid);
      });

      this.uuidEmitter.emit(this.uuid);
  
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
  }

  playPause(): void  {
    if(this.readyToPlay){
    this.wave.playPause();
    this.isPlaying = !this.isPlaying;

    if(this.isPlaying)
    this.store.dispatch(changePlayingSound(this.uuid));

    else{
      this.store.dispatch(stopPlayingSound({}))
     }

    }


  }

  pauseIfOtherIsPlaying(uuid:string){
    if(this.uuid !== uuid && this.wave != null){
      this.wave.pause();
      this.isPlaying = false;
    }
  }

  getAudioLength(seconds:any): string {
    seconds = Math.floor(seconds);
    let minutes: any = Math.floor(seconds / 60);
    seconds = seconds % 60;

    if (seconds < 10) seconds = "0" + seconds;

    return `${minutes}:${seconds}`;
  }

  generateWaveform(): void {
    this.wave = WaveSurfer.create({
      container: `#${this.uuid}`,
      waveColor: "#ffffff",
      progressColor: "#1D105A",
      backend: "WebAudio",
      hideScrollbar: true,
      cursorColor: "rgba(0,0,0,0)",
      barWidth: 2.5,
      barHeight: 0.3,
      barGap:1.5,
      barMinHeight:0.1,
    });

    this.wave.load(this.audioLink);

    this.wave.on("ready", () => {
      this.readyToPlay = true;
      let duration = this.wave.getDuration();
      this.audioLength.next(this.getAudioLength(duration));
    });

    this.wave.on("audioprocess", (t:Number) =>
      this.audioLength.next(this.getAudioLength(t))
    );

    this.wave.on("finish", () => {
      this.isPlaying = false;
      this.store.dispatch(stopPlayingSound({}))
      this.changeDetectorRef.detectChanges();
    });
  }
}
