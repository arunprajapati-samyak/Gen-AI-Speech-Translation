import { Component } from '@angular/core';

@Component({
  selector: 'app-receiver',
  standalone: true,
  imports: [],
  templateUrl: './receiver.component.html',
  styleUrl: './receiver.component.scss'
})
export class ReceiverComponent {
  title: string = 'Audio Player with Transcription';
  audioSource: string = 'assets/sample-audio.mp3'; // Path to your audio file
  isAudioPlaying: boolean = true;
  transcription: string = 'This is the transcription of the audio content.';

  toggleAudio(audioPlayer: HTMLAudioElement): void {
    if (this.isAudioPlaying) {
      audioPlayer.pause();
    } else {
      audioPlayer.play();
    }
    this.isAudioPlaying = !this.isAudioPlaying;
  }
}
