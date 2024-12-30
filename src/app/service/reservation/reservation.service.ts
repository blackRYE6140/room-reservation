import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reservation } from '../../class/reservation/reservation';
import { Observable } from 'rxjs';

const baseUrl = 'https://reservation-back-bd-api.vercel.app/api/reservation';
@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(baseUrl);
  }

  create(data: any): Observable<any> {
    
    console.log("Données à envoyer :", data);
    return this.http.post(baseUrl+ '/add', data);
  }

  update(id: any, data: any): Observable<any> {
    // Ensure numch is serialized as JSON
    const updatedData = { ...data, numch: JSON.stringify(data.numch) };
    return this.http.put(`${baseUrl}/${id}`, updatedData);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  
  search(startDate: string, endDate: string): Observable<any> {
    return this.http.post(baseUrl + '/search', { startDate, endDate });
  }


  
}
