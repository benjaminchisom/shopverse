import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
    private apiUrl = 'http://localhost:3001/auth';

  constructor(private http: HttpClient) {}

  signup(userData: {
    fullName: string;
    email: string;
    password: string;
    gender: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, userData);
  }

  signin(credentials: {
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/signin`, credentials);
  }
}
