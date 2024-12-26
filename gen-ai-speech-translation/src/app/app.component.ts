import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReceiverComponent } from "./features/receiver/receiver.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReceiverComponent,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'gen-ai-speech-translation';
}
