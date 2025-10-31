import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Usuario {
  id: number;
  email: string;
  nome: string;
  username: string;
  tipo: 'admin' | 'usuario';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioAtualSubject: BehaviorSubject<Usuario | null>;
  public usuarioAtual: Observable<Usuario | null>;

  constructor(private router: Router) {
    this.usuarioAtualSubject = new BehaviorSubject<Usuario | null>(
      JSON.parse(localStorage.getItem('usuarioAtual') || 'null')
    );
    this.usuarioAtual = this.usuarioAtualSubject.asObservable();
  }

  public get usuarioAtualValue(): Usuario | null {
    return this.usuarioAtualSubject.value;
  }

  login(email: string, senha: string): boolean {
    // Usando seu usuário admin real do backend
    if (email === 'pedrofortal@example.com' && senha === '123456') {
      const usuario: Usuario = {
        id: 1,
        email: 'pedrofortal@example.com',
        nome: 'Pedro Lucas Mendonça Fortaleza',
        username: 'pedrofortal',
        tipo: 'admin'
      };
      
      localStorage.setItem('usuarioAtual', JSON.stringify(usuario));
      this.usuarioAtualSubject.next(usuario);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('usuarioAtual');
    this.usuarioAtualSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    return this.usuarioAtualValue?.tipo === 'admin';
  }

  isLoggedIn(): boolean {
    return this.usuarioAtualValue !== null;
  }
}