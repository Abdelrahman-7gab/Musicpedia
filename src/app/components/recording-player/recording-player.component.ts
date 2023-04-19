import { Component, Input,Output, EventEmitter, AfterViewInit,ChangeDetectorRef, OnChanges, SimpleChanges  } from "@angular/core";
import WaveSurfer from "wavesurfer.js";
import { v4 as uuidv4 } from "uuid";
import { Subject } from "rxjs";
import { throttleTime } from "rxjs/operators";

@Component({
  selector: "app-recording-player",
  templateUrl: "./recording-player.component.html",
  styleUrls: ["./recording-player.component.scss"],
})
export class RecordingPlayerComponent implements AfterViewInit,OnChanges {
  @Input() audioLink: string = "";
  @Output() audioIsPlaying = new EventEmitter<string>();
  @Input() playingAudio:string = "";
  wave: any = null;
  uuid: string;
  readyToPlay:boolean = false;

  isPlaying: boolean = false;
  audioLength = new Subject<string>();
  currentLength: string = "0:00";

  constructor(private changeDetectorRef:ChangeDetectorRef) {
    this.uuid = "n" + uuidv4();
  }
  ngOnChanges(changes: SimpleChanges): void
  {
    if(changes["playingAudio"].currentValue !== changes["playingAudio"].previousValue)
    {
     this.pauseIfOtherIsPlaying(changes["playingAudio"].currentValue);
    }
  }

  ngAfterViewInit() {
    this.audioLength.pipe(throttleTime(100)).subscribe((t) => {
      this.currentLength = t;
      this.changeDetectorRef.detectChanges();
    });

    //  this.generateWaveform();
      this.generateWaveform();
  
  }

  playPause() {
    if(this.readyToPlay){
    this.wave.playPause();
    this.isPlaying = !this.isPlaying;

    if(this.isPlaying)
    this.audioIsPlaying.emit(this.uuid);
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
      this.changeDetectorRef.detectChanges();
    });
  }
}
