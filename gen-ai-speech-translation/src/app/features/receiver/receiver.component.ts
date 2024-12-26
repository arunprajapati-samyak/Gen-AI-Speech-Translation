import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { GoogleTtsService } from '../google-tts.service';
import { HttpClientModule } from '@angular/common/http';

declare var window: any;

@Component({
  selector: 'app-receiver',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  providers: [GoogleTtsService],
  templateUrl: './receiver.component.html',
  styleUrl: './receiver.component.scss'
})
export class ReceiverComponent {
  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    private googleTtsService: GoogleTtsService) { }
  textToTranslate: string = '';
  languageCode: string = 'hi-IN';
  title: string = 'Audio Dashboard with Transcription';
  transcription: string =
    'This is the transcription of the conversation. It can span multiple lines based on the content. This is the transcription of the conversation. It can span multiple lines based on the content. This is the transcription of the conversation. It can span multiple lines based on the content. This is the transcription of the conversation. It can span multiple lines based on the content.This is the transcription of the conversation. It can span multiple lines based on the content. This is the transcription of the conversation. It can span multiple lines based on the content. This is the transcription of the conversation. It can span multiple lines based on the content.';
  cards = [
    { name: 'John Doe', type: 'Speaker', imageState: 'mic' },
    { name: 'Jane Smith', type: 'Receiver', imageState: 'mic' },
    { name: 'Alice Johnson', type: 'Speaker', imageState: 'mic' },
    { name: 'Bob Brown', type: 'Receiver', imageState: 'mic' },
    { name: 'John Doe', type: 'Speaker', imageState: 'mic' },
    { name: 'Jane Smith', type: 'Receiver', imageState: 'mic' },
    { name: 'Alice Johnson', type: 'Speaker', imageState: 'mic' },
    { name: 'Bob Brown', type: 'Receiver', imageState: 'mic' }
  ];
  textToRead: string = 'आसमाँ को ज़मीं ये ज़रूरी नहीं जान ले, जान ले इश्क़ सच्चा वही जिसको मिलती नहीं मंज़िलें, मंज़िलें रंग थे, नूर था, जब क़रीब तू था एक जन्नत सा था ये जहाँवक्त की रेत पे कुछ मेरे नाम सा लिख के छोड़ गया तू कहाँ?';

  selectedCard: any = null; // Store details of the selected card

  ngOnInit(): void {
    // this.speakText();
    this.onTranslateAndSpeak()
  }

  onTranslateAndSpeak() {
    // Use the Google Text-to-Speech API
    this.googleTtsService.generateSpeech(this.textToRead, this.languageCode).subscribe(
      (response: any) => {
        const audioContent = response.audioContent;
        this.playAudio(audioContent);
      },
      error => {
        console.error('Error converting text to speech:', error);
      }
    );
  }

  playAudio(audioContent: string) {
    // Decode the base64 audio content and play it
    const audio = new Audio('data:audio/mp3;base64,' + audioContent);
    audio.play();
  }

  // Method to convert text to speech
  speakText(): void {
    if (isPlatformBrowser(this.platformId)) {
      if ('SpeechSynthesis' in window) {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(this.textToRead);
        utterance.lang = "hi-IN";
        synth.speak(utterance);
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
    if (card.type === 'Speaker') {
      card.imageState = card.imageState === 'mic' ? 'sound' : 'mic';
    }
  }

  displayCardDetails(card: any): void {
    this.selectedCard = card;
    console.log('Selected card:', card);
  }
}
