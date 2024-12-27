import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiintegrateService } from '../../services/apiintegrate.service';

@Component({
  selector: 'app-speech-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './speech-summary.component.html',
  styleUrl: './speech-summary.component.scss'
})
export class SpeechSummaryComponent {
  summaryTitle: any = "Speech Summary"
  summaryPoints: string[] = [
    'Point 1: Overview of Angular features',
    'Point 2: Data binding and component interaction',
    'Point 3: Directives and pipes usage',
    'Point 4: Services and dependency injection',
    'Point 5: Routing and navigation',
    'Point 1: Overview of Angular features',
    'Point 2: Data binding and component interaction',
    'Point 3: Directives and pipes usage',
    'Point 4: Services and dependency injection',
    'Point 5: Routing and navigation',
    'Point 1: Overview of Angular features',
    'Point 2: Data binding and component interaction',
    'Point 3: Directives and pipes usage',
    'Point 4: Services and dependency injection',
    'Point 5: Routing and navigation',
    'Point 1: Overview of Angular features',
    'Point 2: Data binding and component interaction',
    'Point 3: Directives and pipes usage',
    'Point 4: Services and dependency injection',
    'Point 5: Routing and navigation'
  ];
  

  constructor(private apiintegration: ApiintegrateService) { }


  getSummaryDetails()
  {
    // this.apiintegration.translate('Hello', 'es').subscribe({
    //   next: (response) => console.log(response),
    //   error: (err) => console.error(err),
    // });
  }
}
