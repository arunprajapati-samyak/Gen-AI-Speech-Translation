import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ApiintegrateService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'http://10.100.111.43:8585/summary';  


  getSummary(text: string): Observable<any> {
    const requestBody = { text };
    return this.http.post<any>(this.apiUrl, requestBody);
  }

  postData(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  getData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
