import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';

declare var window: any;

@Component({
  selector: 'app-receiver',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './receiver.component.html',
  styleUrl: './receiver.component.scss'
})
export class ReceiverComponent {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
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
  textToRead: string = 'A well-organized paragraph supports or develops a single controlling idea, which is expressed in a sentence called the topic sentence. A topic sentence has several important functions: it substantiates or supports an essay’s thesis statement; it unifies the content of a paragraph and directs the order of the sentences; and it advises the reader of the subject to be discussed and how the paragraph will discuss it. Readers generally look to the first few sentences in a paragraph to determine the subject and perspective of the paragraph. That’s why it’s often best to put the topic sentence at the very beginning of the paragraph. In some cases, however, it’s more effective to place another sentence before the topic sentence—for example, a sentence linking the current paragraph to the previous one, or one providing background information.';

  selectedCard: any = null; // Store details of the selected card

  ngOnInit(): void {
    // Check if the code is running in the browser environment
      // Call the speakText function when the component is initialized
      this.speakText();
  }

  // Method to convert text to speech
  speakText(): void {
    if (isPlatformBrowser(this.platformId)) {
      if ('speechSynthesis' in window) {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(this.textToRead);
        utterance.lang = "";
        synth.speak(utterance);
      }
    } else {
      console.error('Window object is not available in the current platform.');
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
