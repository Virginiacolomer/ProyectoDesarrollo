// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { config } from '../config/env';

interface LoginResponse {
  token: string;
}

interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${config.baseUrl}/${config.endpoints.auth.login}`,
      { email, password }
    );
  }

  register(data: { name: string; email: string; password: string }) {
    return this.http.post(
      `${config.baseUrl}/${config.endpoints.auth.register}`,
      data
    );
  }
}