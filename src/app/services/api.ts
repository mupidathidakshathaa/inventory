import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = '/api';

  // Auth
  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, data);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, data);
  }

  // Inventory
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/inventory`);
  }

  addProduct(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/inventory`, data);
  }

  updateProduct(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/inventory/${id}`, data);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/inventory/${id}`);
  }

  // Sales
  getSales(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/sales`);
  }

  uploadSales(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/sales/upload`, formData);
  }

  // ML
  predictRF(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/ml/predict-rf`);
  }

  predictLSTM(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/ml/predict-lstm`);
  }

  clusterProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/ml/cluster`);
  }
}
