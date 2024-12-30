import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chambre } from '../../class/chambre/chambre';
import { Observable } from 'rxjs';

const baseUrl = 'https://render-api-eb6f.onrender.com/api/chambre';
@Injectable({
  providedIn: 'root'
})
export class ChambreService {

  constructor(private http: HttpClient) { }



  getAll(): Observable<Chambre[]> {
    return this.http.get<Chambre[]>(baseUrl);
  }

  create(data: any): Observable<any> {
    
    console.log("Données à envoyer :", data);
    return this.http.post(baseUrl+ '/add', data);
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
}
