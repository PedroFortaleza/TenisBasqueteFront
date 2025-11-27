// esporte.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Esporte } from '../../models/esporte.model';
import { Tenis } from '../../models/tenis.model';
import { EsporteService } from '../../services/esporte.service';
import { TenisService } from '../../services/tenis.service';

@Component({
  selector: 'app-esporte',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './esporte.component.html',
  styleUrls: ['./esporte.component.css']
})
export class EsporteComponent implements OnInit {
  esportes: Esporte[] = [];
  tenis: Tenis[] = [];
  esporteSelecionado: Esporte | null = null;
  carregandoEsportes: boolean = false;
  carregandoTenis: boolean = false;
  erro: string = '';

  constructor(
    private esporteService: EsporteService,
    private tenisService: TenisService
  ) { }

  ngOnInit(): void {
    this.carregarEsportes();
  }

  carregarEsportes(): void {
    this.carregandoEsportes = true;
    this.erro = '';
    
    this.esporteService.getAtivos().subscribe({
      next: (esportes) => {
        this.esportes = esportes;
        this.carregandoEsportes = false;
      },
      error: (error) => {
        console.error('Erro ao carregar esportes:', error);
        this.erro = 'Erro ao carregar esportes. Tente novamente.';
        this.carregandoEsportes = false;
      }
    });
  }

  selecionarEsporte(esporte: Esporte): void {
    this.esporteSelecionado = esporte;
    this.carregarTenisPorEsporte(esporte.id);
  }

  carregarTenisPorEsporte(esporteId: number): void {
    this.carregandoTenis = true;
    this.erro = '';
    
    this.tenisService.getByEsporte(esporteId).subscribe({
      next: (tenis) => {
        this.tenis = tenis.filter(t => t.ativo);
        this.carregandoTenis = false;
      },
      error: (error) => {
        console.error('Erro ao carregar tênis:', error);
        this.erro = 'Erro ao carregar tênis. Tente novamente.';
        this.carregandoTenis = false;
      }
    });
  }

  limparSelecao(): void {
    this.esporteSelecionado = null;
    this.tenis = [];
  }

  formatarPreco(preco: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco);
  }
}