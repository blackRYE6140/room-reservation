import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '../../class/login/login';
import { Observable } from 'rxjs';

const baseUrl = 'https://render-api-1-3u8t.onrender.com/api/login';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(baseUrl + '/auth', { username, password});
  };
}