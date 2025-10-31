import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cor } from '../models/cor.model';

export type { Cor }; // ← ADICIONAR ESTA LINHA

@Injectable({
  providedIn: 'root'
})
export class CorService {
  private apiUrl = 'http://localhost:8080/cores';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Cor[]> {
    return this.http.get<Cor[]>(this.apiUrl);
  }

  getById(id: number): Observable<Cor> {
    return this.http.get<Cor>(`${this.apiUrl}/${id}`);
  }

  create(cor: Cor): Observable<Cor> {
    return this.http.post<Cor>(this.apiUrl, cor);
  }

  update(id: number, cor: Cor): Observable<Cor> {
    return this.http.put<Cor>(`${this.apiUrl}/${id}`, cor);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAtivas(): Observable<Cor[]> {
    return this.http.get<Cor[]>(`${this.apiUrl}/ativas`);
  }
}