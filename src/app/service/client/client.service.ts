import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client } from '../../class/client/client'; 
import { Observable } from 'rxjs';

const baseUrl = 'https://render-api-1-3u8t.onrender.com/api/client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Client[]> {
    return this.http.get<Client[]>(baseUrl);
  }

  create(data: any): Observable<any> {
    console.log("Données à envoyer :", data);
    return this.http.post(baseUrl + '/add', data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  search(searchKeyword: string): Observable<any> {
    return this.http.post(baseUrl + '/search', { recherche: searchKeyword });
  }

  getClientById(id: any): Observable<Client> {
    return this.http.get<Client>(`${baseUrl}/${id}`);
  }
}
