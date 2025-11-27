// gerenciamento-geral.component.ts (mantido igual - apenas o design foi atualizado)
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-gerenciamento-geral',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gerenciamento-geral.component.html',
  styleUrls: ['./gerenciamento-geral.component.css']
})
export class GerenciamentoGeralComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verifica se é admin, se não, redireciona
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/login']);
    }
  }

  voltarParaPerfil(): void {
    this.router.navigate(['/perfil']);
  }

  gerenciarMarcas(): void {
    this.router.navigate(['/gerenciar-marcas']);
  }

  gerenciarModelos(): void {
    this.router.navigate(['/gerenciar-modelos']);
  }

  gerenciarCores(): void {
    this.router.navigate(['/gerenciar-cores']);
  }

  gerenciarEsportes(): void {
    this.router.navigate(['/gerenciar-esportes']);
  }
}