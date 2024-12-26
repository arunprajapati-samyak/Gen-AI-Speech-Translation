import { CommonModule } from '@angular/common';
import { Component, NgZone, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SignalRService } from '../../services/signalr.service';

@Component({
  selector: 'app-host',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './host.component.html',
  styleUrl: './host.component.scss'
})
export class HostComponent implements OnInit {
  title: string = 'Audio Dashboard with Transcription';
  constructor(private ngZone: NgZone, private signalRService: SignalRService) { }
  ngOnInit(): void {
    this.signalRService.startConnection();
    //this.signalRService.addMessageListener();
  }
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
  public isRecognizing: boolean = false;
  public fulltranscription: string = '';


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
    if (!this.isRecognizing) {
      this.setupSpeechRecognition();  // Set up SpeechRecognition
    }
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

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            this.fulltranscription += event.results[i][0].transcript;
            this.signalRService.sendMessage("Arun", event.results[i][0].transcript);
          }
        }
        this.ngZone.run(() => {
          this.transcription = command;  // Set the transcription
        });

        console.log(command);
        console.log(event);
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };
    }
  }

  toggleRecognition() {
    if (this.isRecognizing) {
      this.stopRecognition();
    } else {
      this.startRecognition();
    }
  }

  startRecognition() {
    if (this.recognition) {
      this.recognition.start();
      this.isRecognizing = true;
    }
  }

  stopRecognition() {
    if (this.recognition) {
      this.recognition.stop();
      this.isRecognizing = false;
    }
  }


}
