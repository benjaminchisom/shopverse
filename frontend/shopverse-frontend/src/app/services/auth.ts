import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

export interface AccountUser {
  id: number;
  fullName: string;
  email: string;
}

export interface AccountResponse {
  user: AccountUser;
}

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

  me(): Observable<AccountResponse> {
    const token = localStorage.getItem('accessToken');

    const headers: Record<string, string> = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return this.http
      .get<AccountResponse>(`${this.apiUrl}/me`, { headers })
      .pipe(timeout(10000));
  }
}