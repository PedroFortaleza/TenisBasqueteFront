import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemCarrinho } from '../models/carrinho.model';

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {
  private apiUrl = 'http://localhost:8080/carrinho';

  constructor(private http: HttpClient) { }

  getItensCarrinho(usuarioId: number): Observable<ItemCarrinho[]> {
    return this.http.get<ItemCarrinho[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  adicionarItemCarrinho(itemCarrinho: ItemCarrinho): Observable<ItemCarrinho> {
    return this.http.post<ItemCarrinho>(`${this.apiUrl}/item`, itemCarrinho);
  }

  atualizarItemCarrinho(id: number, itemCarrinho: ItemCarrinho): Observable<ItemCarrinho> {
    return this.http.put<ItemCarrinho>(`${this.apiUrl}/item/${id}`, itemCarrinho);
  }

  removerItemCarrinho(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/item/${id}`);
  }

  limparCarrinho(usuarioId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  getQuantidadeItens(usuarioId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/usuario/${usuarioId}/quantidade`);
  }

  calcularTotalCarrinho(usuarioId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/usuario/${usuarioId}/total`);
  }
}