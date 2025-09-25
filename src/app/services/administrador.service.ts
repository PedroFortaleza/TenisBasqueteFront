import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Administrador } from '../models/administrador.model';

@Injectable({
  providedIn: 'root'
})
export class AdministradorService {
  private apiUrl = 'http://localhost:8080/administradores';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Administrador[]> {
    return this.http.get<Administrador[]>(this.apiUrl);
  }

  getByUsername(username: string): Observable<Administrador> {
    return this.http.get<Administrador>(`${this.apiUrl}/${username}`);
  }

  create(administrador: Administrador): Observable<Administrador> {
    return this.http.post<Administrador>(this.apiUrl, administrador);
  }

  update(username: string, administrador: Administrador): Observable<Administrador> {
    return this.http.put<Administrador>(`${this.apiUrl}/${username}`, administrador);
  }

  delete(username: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${username}`);
  }

  // Método específico para verificar se o administrador está ativo
  checkAtivo(username: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${username}/ativo`);
  }
}