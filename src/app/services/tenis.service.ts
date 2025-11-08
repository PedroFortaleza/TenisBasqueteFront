import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tenis } from '../models/tenis.model';

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

  // NOVOS MÉTODOS PARA TRABALHAR COM TAMANHOS
  getByTamanho(tamanho: string): Observable<Tenis[]> {
    return this.http.get<Tenis[]>(`${this.apiUrl}/tamanho/${tamanho}`);
  }

  searchByNome(nome: string): Observable<Tenis[]> {
    return this.http.get<Tenis[]>(`${this.apiUrl}/search/${nome}`);
  }

  getDestaques(limit: number = 10): Observable<Tenis[]> {
    return this.http.get<Tenis[]>(`${this.apiUrl}/destaques?limit=${limit}`);
  }

  getComFiltros(filtros: any): Observable<Tenis[]> {
    let params = new URLSearchParams();
    
    if (filtros.nome) params.append('nome', filtros.nome);
    if (filtros.genero) params.append('genero', filtros.genero);
    if (filtros.corId) params.append('corId', filtros.corId.toString());
    if (filtros.esporteId) params.append('esporteId', filtros.esporteId.toString());
    if (filtros.tamanho) params.append('tamanho', filtros.tamanho);
    if (filtros.ativo !== undefined) params.append('ativo', filtros.ativo.toString());
    
    return this.http.get<Tenis[]>(`${this.apiUrl}/filtros?${params.toString()}`);
  }

  getPorFaixaPreco(precoMin: number, precoMax: number): Observable<Tenis[]> {
    return this.http.get<Tenis[]>(`${this.apiUrl}/preco?min=${precoMin}&max=${precoMax}`);
  }

  // Método para obter todos os tamanhos disponíveis
  getTamanhosDisponiveis(): string[] {
    return ['34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'];
  }
}