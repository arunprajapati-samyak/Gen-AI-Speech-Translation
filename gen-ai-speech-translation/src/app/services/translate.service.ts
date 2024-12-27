import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface TranslationResponse {
  translations: { text: string }[];
}

@Injectable({
  providedIn: 'root',
})
export class TranslateService {
  private apiKey: string = 'CrtrD2IQdesMRJnQHj6HkSBPcDNfkbmrPrOTf8w3rW2xUL6fUJsJJQQJ99ALACYeBjFXJ3w3AAAbACOG0Niv';
  private endpoint: string = 'https://api.cognitive.microsofttranslator.com/';
  private region: string = 'eastus';
 
  constructor(private http: HttpClient) {}
 
  translateText(text: string, toLanguage: string): Observable<any> {
    const url = `${this.endpoint}translate?api-version=3.0&to=${toLanguage}`;
    const headers = new HttpHeaders({
      'Ocp-Apim-Subscription-Key': this.apiKey,
      'Ocp-Apim-Subscription-Region': this.region,
      'Content-Type': 'application/json',
    });
 
    const body = [{ Text: text }];
    console.log(body);
    return this.http.post<any>(url, body, { headers });
  }
}
