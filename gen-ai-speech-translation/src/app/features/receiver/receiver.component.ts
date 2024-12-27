import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { SignalRService } from '../../services/signa-r.service';

interface Window {
  speechSynthesis: SpeechSynthesis;
}

declare var window: any;

@Component({
  selector: 'app-receiver',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './receiver.component.html',
  styleUrls: ['./receiver.component.scss']
})
export class ReceiverComponent implements OnInit {
  messages: { user: string; message: string }[] = [];
  loggedInUsers: { userName: string, type: string, lang: string }[] = [];
  username: string = '';
  message: string = '';
  title: string = 'Audio Dashboard with Transcription';
  transcription: string = 'This is the transcription of the conversation. It can span multiple lines based on the content...';
  cards = [
    { name: 'John Doe', type: 'Speaker', imageState: 'mic' },
    { name: 'Jane Smith', type: 'Receiver', imageState: 'mic' },
    { name: 'Alice Johnson', type: 'Speaker', imageState: 'mic' },
    { name: 'Bob Brown', type: 'Receiver', imageState: 'mic' }
  ];
  textToRead: string = 'This is the transcription of the conversation. It can span multiple lines based on the content...';

  selectedCard: any = null;
  currentChunkIndex: number = 0; // To track the current chunk being spoken
  chunks: string[] = []; // To store the chunks for later resumption
  synth: SpeechSynthesis = window.speechSynthesis; // Global synth object to manage speech state
  isPaused: boolean = false; // Track if speech is paused
  currentUtterance: SpeechSynthesisUtterance | null = null; // To track the current utterance being spoken

  // Track listener positions
  listenerPositions: { [userId: string]: number } = {}; // To track the position of each listener

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private signalRService: SignalRService) { }

  ngOnInit(): void {
    this.signalRService.messages$.subscribe((messages) => {
      this.messages = messages;
      console.log(this.messages);
    });

    this.signalRService.users$.subscribe((users: any) => {
      this.loggedInUsers = users;
      console.log(this.loggedInUsers);
    });

    this.speakText(); // Optionally start speaking on init if required
  }

  // Method to convert text to speech
  speakText(): void {
    if (isPlatformBrowser(this.platformId)) {
      if ('speechSynthesis' in window) {
        // Split the text into chunks for easier control
        this.chunks = this.textToRead.match(new RegExp(`.{1,150}(\\s|$)`, 'g')) || [this.textToRead];

        this.speakNextChunk(this.synth);
      }
    }
  }
  handleAudio(type: string): void {
    if (type === 'Speaker') {
      console.log('Toggle microphone functionality.');
    } else {
      console.log('Toggle sound functionality.');
    }
  }

  // Speak next chunk of text
  speakNextChunk(synth: SpeechSynthesis): void {
    if (this.currentChunkIndex < this.chunks.length) {
      const utterance = new SpeechSynthesisUtterance(this.chunks[this.currentChunkIndex].trim());
      utterance.lang = "en-US";

      // Handle when the current chunk finishes speaking
      utterance.onend = () => {
        this.currentChunkIndex++;
        this.speakNextChunk(synth); // Speak the next chunk
      };

      utterance.onerror = (error) => {
        console.error("Error speaking chunk:", error);
        this.currentChunkIndex++;
        this.speakNextChunk(synth); // Skip to next chunk if error occurs
      };

      this.currentUtterance = utterance; // Track the current utterance
      synth.speak(utterance); // Speak the current chunk
    }
  }

  // Toggle mic state for speaker cards and adjust volume accordingly
  toggleImage(card: any): void {
    console.log("Card : ", card);

    card.imageState = card.imageState === 'mic' ? 'sound' : 'mic';
    this.selectedCard = card;

    if (card.imageState !== 'mic') {
      // If mic is off, pause the speech
      this.isPaused = true; // Set the pause flag
      this.synth.pause();
    } else {
      if (this.isPaused) {
        // If speech was paused, resume from where it left off
        this.isPaused = false;
        this.synth.resume();
      } else {
        // Start new speech if not paused
        this.speakText();
      }

      // Notify listeners that the speaker's mic has been turned on again
      this.notifyListeners();
    }
  }

  // Notify listeners about the current speech position
  notifyListeners(): void {
    // Broadcast the current chunk index to listeners
    for (const user of this.loggedInUsers) {
      if (this.listenerPositions[user.userName] !== undefined) {
        // If the listener has already been tracking, update the chunk position
        this.listenerPositions[user.userName] = this.currentChunkIndex;
      } else {
        // If the listener is new, they start listening from the current position
        this.listenerPositions[user.userName] = this.currentChunkIndex;
      }
    }
  }

  // Start from the current chunk index for listeners
  resumeForListeners(): void {
    for (const user of this.loggedInUsers) {
      if (this.listenerPositions[user.userName] !== undefined) {
        const startChunkIndex = this.listenerPositions[user.userName];
        // Start speaking from the listener's saved position
        this.currentChunkIndex = startChunkIndex;
        this.speakNextChunk(this.synth);
      }
    }
  }

  // Display selected card details (for debugging purposes)
  displayCardDetails(card: any): void {
    this.selectedCard = card;
    console.log('Selected card:', card);
  }
}
