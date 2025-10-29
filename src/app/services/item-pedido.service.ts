import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemPedido } from '../models/item-pedido.model';

@Injectable({
  providedIn: 'root'
})
export class ItemPedidoService {
  private apiUrl = 'http://localhost:8080/itens-pedido';

  constructor(private http: HttpClient) { }

  getAll(): Observable<ItemPedido[]> {
    return this.http.get<ItemPedido[]>(this.apiUrl);
  }

  getById(id: number): Observable<ItemPedido> {
    return this.http.get<ItemPedido>(`${this.apiUrl}/${id}`);
  }

  create(itemPedido: ItemPedido): Observable<ItemPedido> {
    return this.http.post<ItemPedido>(this.apiUrl, itemPedido);
  }

  update(id: number, itemPedido: ItemPedido): Observable<ItemPedido> {
    return this.http.put<ItemPedido>(`${this.apiUrl}/${id}`, itemPedido);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Métodos específicos para itens de pedido
  getByPedidoId(pedidoId: number): Observable<ItemPedido[]> {
    return this.http.get<ItemPedido[]>(`${this.apiUrl}/pedido/${pedidoId}`);
  }

  calcularSubtotal(itemPedido: ItemPedido): number {
    return itemPedido.quantidade * itemPedido.precoUnitario;
  }
}