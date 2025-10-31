import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Esporte } from '../models/esporte.model';

export type { Esporte }; // ← ADICIONAR ESTA LINHA

@Injectable({
  providedIn: 'root'
})
export class EsporteService {
  private apiUrl = 'http://localhost:8080/esportes';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Esporte[]> {
    return this.http.get<Esporte[]>(this.apiUrl);
  }

  getById(id: number): Observable<Esporte> {
    return this.http.get<Esporte>(`${this.apiUrl}/${id}`);
  }

  create(esporte: Esporte): Observable<Esporte> {
    return this.http.post<Esporte>(this.apiUrl, esporte);
  }

  update(id: number, esporte: Esporte): Observable<Esporte> {
    return this.http.put<Esporte>(`${this.apiUrl}/${id}`, esporte);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAtivos(): Observable<Esporte[]> {
    return this.http.get<Esporte[]>(`${this.apiUrl}/ativos`);
  }
}