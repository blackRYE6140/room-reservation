import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const baseUrl = 'https://hkejpxcvmjrtueiedgdjjhiulpqoiertdgdcgcdd.vercel.app/api/dashboard';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }
 
  getCli(): Observable<any> {
    return this.http.get(baseUrl+ '/countCli');
  }
  getCh(): Observable<any> {
    return this.http.get(baseUrl+ '/countCh');
  }
  getRes(): Observable<any> {
    return this.http.get(baseUrl+ '/countRes');
  }
  getUt(): Observable<any> {
    return this.http.get(baseUrl+ '/countUt');
  }
}
