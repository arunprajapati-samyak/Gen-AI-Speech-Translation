// src/app/services/google-tts.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GoogleTtsService {

  private apiUrl: string = 'https://texttospeech.googleapis.com/v1/text:synthesize';
  private apiKey: string = 'AIzaSyDbNxV6rg6dHsgLgSJXgPLKPljkS7uE20c';  // Replace with your API Key

  constructor(private http: HttpClient) { }

  generateSpeech(text: string, languageCode: string = 'en-US'): Observable<any> {
    const body = {
      input: { text: text },
      voice: {
        languageCode: languageCode,
        ssmlGender: 'NEUTRAL',  // You can change this to 'MALE' or 'FEMALE'
      },
      audioConfig: {
        audioEncoding: 'MP3',
      },
    };

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    });

    return this.http.post(this.apiUrl, body, { headers });
  }
}
