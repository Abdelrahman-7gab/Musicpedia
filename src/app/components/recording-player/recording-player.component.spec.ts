import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordingPlayerComponent } from './recording-player.component';

describe('RecordingPlayerComponent', () => {
  let component: RecordingPlayerComponent;
  let fixture: ComponentFixture<RecordingPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordingPlayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordingPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
