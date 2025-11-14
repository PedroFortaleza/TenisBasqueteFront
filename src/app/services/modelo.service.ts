import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Modelo } from '../models/modelo.model';

@Injectable({
  providedIn: 'root'
})
export class ModeloService {
  private apiUrl = 'http://localhost:8080/modelos';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Modelo[]> {
    return this.http.get<Modelo[]>(this.apiUrl);
  }

  getById(id: number): Observable<Modelo> {
    return this.http.get<Modelo>(`${this.apiUrl}/${id}`);
  }

  create(modelo: Modelo): Observable<Modelo> {
    // Garantir que o modelo tenha todos os campos necessários
    const modeloCompleto = this.prepararModeloParaBackend(modelo);
    return this.http.post<Modelo>(this.apiUrl, modeloCompleto);
  }

  update(id: number, modelo: Modelo): Observable<Modelo> {
    const modeloCompleto = this.prepararModeloParaBackend(modelo);
    return this.http.put<Modelo>(`${this.apiUrl}/${id}`, modeloCompleto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private prepararModeloParaBackend(modelo: Modelo): any {
    return {
      id: modelo.id,
      nome: modelo.nome,
      tamanho: modelo.tamanho || '40',
      preco: modelo.preco || 0,
      cor: modelo.cor || 'Preto',
      emEstoque: modelo.ativo !== undefined ? modelo.ativo : modelo.emEstoque
    };
  }
}