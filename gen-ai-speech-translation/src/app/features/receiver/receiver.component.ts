import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-receiver',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './receiver.component.html',
  styleUrl: './receiver.component.scss'
})
export class ReceiverComponent {
  title: string = 'Audio Dashboard with Transcription';
  transcription: string =
    'This is the transcription of the conversation. It can span multiple lines based on the content.';
  cards = [
    { name: 'John Doe', type: 'Speaker' },
    { name: 'Jane Smith', type: 'Receiver' },
    { name: 'Alice Johnson', type: 'Speaker' },
    { name: 'Bob Brown', type: 'Receiver' }
  ];

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
}
