import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, Usuario } from '../../services/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario: Usuario | null = null;
  isAdmin: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.usuarioAtualValue;
    this.isAdmin = this.authService.isAdmin();
    
    if (!this.usuario) {
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    this.authService.logout();
  }

  irParaCadastroTenis(): void {
    this.router.navigate(['/gerenciar-tenis']);
  }

  irParaGerenciamentoGeral(): void {
    this.router.navigate(['/gerenciamento-geral']);
  }

  get nomeUsuario(): string {
    return this.usuario?.nome || 'Usuário';
  }

  get emailUsuario(): string {
    return this.usuario?.email || '';
  }

  get usernameUsuario(): string {
    return this.usuario?.username || '';
  }
}