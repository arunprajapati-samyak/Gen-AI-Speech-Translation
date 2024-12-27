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
  styleUrl: './receiver.component.scss'
})
export class ReceiverComponent implements OnInit {
  messages: { user: string; message: string }[] = [];
  loggedInUsers: {userName : string, type: string, lang:string}[] = [];
  username: string = '';
  message: string = '';
  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    private signalRService: SignalRService) { }
  title: string = 'Audio Dashboard with Transcription';
  transcription: string = '';
  cards : {userName : string, type: string, lang:string, imageState: string}[] = [];
  textToRead: string = 'मेरा भारत महान, विश्व का एक अद्वितीय देश है। यह भूमि संस्कृति, ऐतिहासिकता और विविधता से समृद्ध है। यहां अनेक धर्म, भाषाएं और जातियाँ एकत्रित होती हैं। मेरे देश में अद्वितीय स्वतंत्रता संग्राम की कहानी है। मेरा भारत महान, गर्व का स्रोत है और सबके लिए समर्पित है।';

  selectedCard: any = null; // Store details of the selected card

  //synth = window.speechSynthesis;

  ngOnInit(): void {
    // Check if the code is running in the browser environment
    // Call the speakText function when the component is initialized
    // Subscribe to messages
    //this.signalRService.startConnection();

    this.signalRService.messages$.subscribe((messages) => {
      this.messages = messages;
      if (this.messages.length > 0)
        this.speakText(this.messages[0]);
    });

    // Subscribe to logged-in users
    this.signalRService.users$.subscribe((users : any) => {
      //debugger
      users = users.map((res : any) => {
        return {
          userName : res[0],
          type : res[1],
          lang : res[2],
          imageState: 'mic' 
        }
      })
      // this.loggedInUsers = users;
      // console.log(this.loggedInUsers)
      this.cards = users;
      console.log("cards",this.cards)
    });
  }

  // OnClick(): void {
  //   console.log("speaking");

  //   this.speakText()
  //   console.log("again speaking");

  // }

  // Method to convert text to speech
  speakText(msg: any): void {
    if (isPlatformBrowser(this.platformId)) {
      if ('speechSynthesis' in window) {
        const synth = window.speechSynthesis;
        this.transcription = msg.message;
        const utterance = new SpeechSynthesisUtterance(msg.message);
        utterance.lang = "en-US";
        synth.speak(utterance);
      }
    } else {
      console.error('Window object is not available in the current platform.');
      const synth = window.speechSynthesis;

      const speakChunks = (text: string, voices: SpeechSynthesisVoice[]) => {
        const chunkSize = 150; // Character limit per chunk
        const chunks = text.match(new RegExp(`.{1,${chunkSize}}(\\s|$)`, 'g')) || [text];

        // Try to find a Gujarati voice, or fallback to Indian English
        // const gujaratiVoice = voices.find(voice => voice.lang === "gu-IN");
        // const fallbackVoice = voices.find(voice => voice.lang === "en-IN") || voices[0];

        let currentChunkIndex = 0;

        const speakNextChunk = () => {
          if (currentChunkIndex < chunks.length) {
            const utterance = new SpeechSynthesisUtterance(chunks[currentChunkIndex].trim());
            utterance.lang = "hi-IN";
            //utterance.voice = gujaratiVoice || fallbackVoice;

            // On chunk end, move to the next chunk immediately
            utterance.onend = () => {
              currentChunkIndex++;
              speakNextChunk(); // Speak the next chunk without additional delay
            };

            utterance.onerror = (error) => {
              console.error("Error speaking chunk:", error);
              currentChunkIndex++;
              speakNextChunk(); // Skip to the next chunk on error
            };
            synth.cancel();
            synth.speak(utterance);
          }
        };

        speakNextChunk(); // Start speaking chunks
      };

      const initializeVoices = () => {
        const voices = synth.getVoices();
        if (voices.length > 0) {
          speakChunks(this.textToRead, voices);
        } else {
          synth.onvoiceschanged = () => {
            const updatedVoices = synth.getVoices();
            speakChunks(this.textToRead, updatedVoices);
            synth.onvoiceschanged = null; // Prevent multiple executions
          };
        }
      };

      if (synth.getVoices().length > 0) {
        initializeVoices();
      } else {
        setTimeout(initializeVoices, 50);
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

  toggleImage(card: any): void {
    // Toggle the image state only for Speaker type cards
    card.imageState = card.imageState === 'mic' ? 'sound' : 'mic';
  }

  displayCardDetails(card: any): void {
    this.selectedCard = card;
    console.log('Selected card:', card);
  }
}
