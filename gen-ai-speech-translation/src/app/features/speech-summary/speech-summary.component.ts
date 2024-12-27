import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiintegrateService } from '../../services/apiintegrate.service';
import { TranslateService } from '../../services/translate.service';

@Component({
  selector: 'app-speech-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './speech-summary.component.html',
  styleUrl: './speech-summary.component.scss'
})
export class SpeechSummaryComponent implements OnInit {
  summaryTitle: any = "Speech Summary"
  summaryPoints: string[] = [];
  summerizeData: string = "Life is a precious gift. It is the sum of one's work, journey, dreams, joys, sorrows, successes, and battles for change. Life is more of a journey than a destination. It must be lived peacefully and happily. Seeking the meaning and purpose of life is the biggest search in the life of a man, and the questions about the meaning of human life are age-old. Life, however, still has some attractive elements, offering one a ray of hope and positivity, each passing day.We have individuals, families, relatives, and friends who make our lives unique, worth living, and make us feel that our lives are special. Our lives are challenging, but those challenges are what make it worth living.";

  constructor(private apiintegration: ApiintegrateService, private translateService: TranslateService) { }
  ngOnInit(): void {
    this.getSummaryDetails();
  }

  getSummaryDetails() {
    if (sessionStorage) {
      console.log(String(sessionStorage.getItem("SummaryData")));
      this.apiintegration.getSummary(String(sessionStorage.getItem("SummaryData"))).subscribe({
        next: (response) => {
          // console.log(response);
          this.summaryPoints = response.summarized_text;
        },
        error: (err) => console.error(err),
      });
    }
  }

  downloadTextFile() {
    const content = this.summaryPoints.toString();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);

    // Create a temporary anchor element
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'example.txt'; // Name of the file
    anchor.click();

    // Cleanup
    window.URL.revokeObjectURL(url);
    anchor.remove();
  }

  // getTranslatedData(mesage: any) {
  //   this.translateService.translateText(String(mesage), String(sessionStorage.getItem("lang") ?? 'hi')).subscribe((response: any) => {
  //     console.log("response translate : ", response[0].translations[0].text)
  //     //this.transcription = this.transcription + " " + response[0].translations[0].text;
  //     //const utterance = new SpeechSynthesisUtterance(response[0].translations[0].text);
  //     this.summaryPoints = response[0].translations[0].text.split(',');
  //     //utterance.lang = String(sessionStorage.getItem("lang"));
  //     //this.synth.speak(utterance);
  //   });
  // }
}
