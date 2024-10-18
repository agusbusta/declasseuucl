import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders(
    {
      'Content-Type': 'application/json',
    }
  )
};
@Injectable({
  providedIn: 'root'
})
export class DocumentsService {

  constructor(private http: HttpClient) { }

  getDocuments(url: string): Observable<object> {
    return this.http.get(url, httpOptions);
  }
  
  incrementVisitCounter(id: number): Observable<void> {
    return this.http.post<void>(`http://3.18.245.109:8080/documents/${id}/increment-visit`, {}, httpOptions);
  }
  

  getDetail(idDocumento: number): Observable<object> {
    let url = `/api/documents/detail/${idDocumento}`; // Use relative path
    return this.http.get(url, httpOptions);
  }
}
