import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tenis } from '../models/tenis.model';

export type { Tenis }; // ← ADICIONAR ESTA LINHA

@Injectable({
  providedIn: 'root'
})
export class TenisService {
  private apiUrl = 'http://localhost:8080/tenis';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Tenis[]> {
    return this.http.get<Tenis[]>(this.apiUrl);
  }

  getById(id: number): Observable<Tenis> {
    return this.http.get<Tenis>(`${this.apiUrl}/${id}`);
  }

  create(tenis: Tenis): Observable<Tenis> {
    return this.http.post<Tenis>(this.apiUrl, tenis);
  }

  update(id: number, tenis: Tenis): Observable<Tenis> {
    return this.http.put<Tenis>(`${this.apiUrl}/${id}`, tenis);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getByMarca(marcaId: number): Observable<Tenis[]> {
    return this.http.get<Tenis[]>(`${this.apiUrl}/marca/${marcaId}`);
  }

  getByEsporte(esporteId: number): Observable<Tenis[]> {
    return this.http.get<Tenis[]>(`${this.apiUrl}/esporte/${esporteId}`);
  }

  getByGenero(genero: string): Observable<Tenis[]> {
    return this.http.get<Tenis[]>(`${this.apiUrl}/genero/${genero}`);
  }

  getAtivos(): Observable<Tenis[]> {
    return this.http.get<Tenis[]>(`${this.apiUrl}/ativos`);
  }
}