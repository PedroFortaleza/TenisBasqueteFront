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
  isLoading: boolean = true;

  constructor(
    private tenisService: TenisService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarProdutosDestaque();
  }

  carregarProdutosDestaque(): void {
    this.isLoading = true;
    
    // Use getAtivos() para carregar apenas tênis ativos
    this.tenisService.getAtivos().subscribe({
      next: (tenis: Tenis[]) => {
        // Filtrar apenas produtos ativos (segurança extra)
        this.featuredProducts = tenis.filter(produto => produto.ativo === true);
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar produtos:', error);
        this.featuredProducts = [];
        this.isLoading = false;
      }
    });
  }

  verDetalhes(product: Tenis): void {
    // Navega para o componente tenis passando o ID como parâmetro
    this.router.navigate(['/tenis', product.id]);
  }
}