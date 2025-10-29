import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estoque } from '../models/estoque.model';

@Injectable({
  providedIn: 'root'
})
export class EstoqueService {
  private apiUrl = 'http://localhost:8080/estoques';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Estoque[]> {
    return this.http.get<Estoque[]>(this.apiUrl);
  }

  getById(id: number): Observable<Estoque> {
    return this.http.get<Estoque>(`${this.apiUrl}/${id}`);
  }

  create(estoque: Estoque): Observable<Estoque> {
    return this.http.post<Estoque>(this.apiUrl, estoque);
  }

  update(id: number, estoque: Estoque): Observable<Estoque> {
    return this.http.put<Estoque>(`${this.apiUrl}/${id}`, estoque);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Métodos específicos para estoque
  getByLocalizacao(localizacao: string): Observable<Estoque[]> {
    return this.http.get<Estoque[]>(`${this.apiUrl}/localizacao/${localizacao}`);
  }

  getEstoqueBaixo(quantidadeMinima: number): Observable<Estoque[]> {
    return this.http.get<Estoque[]>(`${this.apiUrl}/estoque-baixo?minimo=${quantidadeMinima}`);
  }

  atualizarQuantidade(id: number, novaQuantidade: number): Observable<Estoque> {
    return this.http.patch<Estoque>(`${this.apiUrl}/${id}/quantidade`, { quantidade: novaQuantidade });
  }
}