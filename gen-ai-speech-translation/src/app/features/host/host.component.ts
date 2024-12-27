import { CommonModule } from '@angular/common';
import { Component, NgZone, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SignalRService } from '../../services/signa-r.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-host',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './host.component.html',
  styleUrl: './host.component.scss'
})
export class HostComponent implements OnInit {
  title: string = 'Audio Dashboard with Transcription';

  constructor(private ngZone: NgZone, private signalRService: SignalRService, private router: Router) { }
  ngOnInit(): void {
    //this.signalRService.startConnection();
    //this.signalRService.addMessageListener();
    this.signalRService.users$.subscribe((users: any) => {
      //debugger
      users = users.map((res: any) => {
        return {
          userName: res[0],
          type: res[1],
          lang: res[2],
          imageState: 'mic'
        }
      })
      // this.loggedInUsers = users;
      // console.log(this.loggedInUsers)
      this.cards = users;
      console.log("cards", this.cards)
    });
  }
  transcription: string =
    'This is the transcription of the conversation. It can span multiple lines based on the content.';
  cards: { userName: string, type: string, lang: string, imageState: string }[] = [];
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
      this.recognition.interimResults = false;

      this.recognition.onresult = (event: any) => {
        var last = event.results.length - 1;
        var command = event.results[last][0].transcript;

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            let correctedTranscript = this.correctGrammar(event.results[i][0].transcript);
            this.fulltranscription += correctedTranscript + '. ';
            this.signalRService.sendMessage("Arun", correctedTranscript);
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

  correctGrammar(text: string): string {
    let correctedText = text.charAt(0).toUpperCase() + text.slice(1); // Capitalize first letter

    if (!/[.!?]$/.test(correctedText)) {
      correctedText += '.';
    }

    correctedText = correctedText.replace(/([.!?])\s*/g, '$1 ');

    return correctedText.trim();
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

  logout() {
    sessionStorage.clear()
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([""]);
    });
  }

  stopRecognition() {
    if (this.recognition) {
      this.recognition.stop();
      this.isRecognizing = false;
    }
  }


}
