import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeechSummaryComponent } from './speech-summary.component';

describe('SpeechSummaryComponent', () => {
  let component: SpeechSummaryComponent;
  let fixture: ComponentFixture<SpeechSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpeechSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpeechSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
