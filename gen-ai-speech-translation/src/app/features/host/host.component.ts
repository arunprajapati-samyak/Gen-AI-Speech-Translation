import { Component, NgZone } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-host',
  standalone: true,
  imports: [MatButtonModule,MatIconModule],
  templateUrl: './host.component.html',
  styleUrl: './host.component.scss'
})
export class HostComponent {
  title: string = 'Audio Dashboard with Transcription';
  constructor(private ngZone: NgZone) {}
  transcription: string =
    'This is the transcription of the conversation. It can span multiple lines based on the content.';
  cards = [
    { name: 'John Doe', type: 'Speaker' },
    { name: 'Jane Smith', type: 'Receiver' },
    { name: 'Alice Johnson', type: 'Speaker' },
    { name: 'Bob Brown', type: 'Receiver' }
  ];
  public transcriptions: string = '';
  private recognition: any;
  private isRecognizing: boolean = false;

  selectedCard: any = null; // Store details of the selected card

  handleAudio(type: string): void {
    if (type === 'Speaker') {
      console.log('Toggle microphone functionality.');
    } else {
      console.log('Toggle sound functionality.');
    }
  }

  displayCardDetails(card: any): void {
    this.selectedCard = card;
    console.log('Selected card:', card);
  }

  async showTranscript() {
    this.setupSpeechRecognition();  // Set up SpeechRecognition
  }

  setupSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error('SpeechRecognition is not supported in this browser.');
    } else {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'en-US';
      this.recognition.continuous = true;
      this.recognition.interimResults = true;

      this.recognition.onresult = (event: any) => {
        var last = event.results.length - 1;
        var command = event.results[last][0].transcript;


        this.ngZone.run(() => {
          this.transcription = command;  // Set the transcription
        });

        console.log(command);
      };

      this.recognition.start();

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };
    }
  }
}
