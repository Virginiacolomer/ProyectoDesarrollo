// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import axios, { AxiosError } from 'axios';
import { config } from '../config/env';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = config.baseUrl;

  constructor() {}

  async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await axios.get(`${this.baseUrl}/${endpoint}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await axios.post(`${this.baseUrl}/${endpoint}`, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private handleError(error: AxiosError | any) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

