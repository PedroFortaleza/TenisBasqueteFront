import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TenisService } from '../../services/tenis.service';
import { Tenis } from '../../models/tenis.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  featuredProducts: Tenis[] = [];

  constructor(
    private tenisService: TenisService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarTenis();
  }

  carregarTenis(): void {
    this.tenisService.getAll().subscribe({
      next: (tenis) => {
        this.featuredProducts = tenis;
      },
      error: (error) => {
        console.error('Erro ao carregar tênis:', error);
        // Pode adicionar dados mock aqui se quiser
      }
    });
  }

  verDetalhes(tenis: Tenis): void {
    this.router.navigate(['/tenis'], { 
      state: { tenis: tenis } 
    });
  }
}