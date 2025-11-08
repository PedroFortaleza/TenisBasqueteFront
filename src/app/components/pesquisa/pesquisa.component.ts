import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TenisService } from '../../services/tenis.service';
import { Tenis } from '../../models/tenis.model';

@Component({
  selector: 'app-pesquisa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pesquisa.component.html',
  styleUrls: ['./pesquisa.component.css']
})
export class PesquisaComponent implements OnInit {
  termoPesquisa: string = '';
  resultados: Tenis[] = [];
  todosTenis: Tenis[] = [];
  isLoading: boolean = false;
  nenhumResultado: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tenisService: TenisService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.termoPesquisa = params['q'] || '';
      this.pesquisar(this.termoPesquisa);
    });
  }

  pesquisar(termo: string): void {
    this.isLoading = true;
    this.nenhumResultado = false;
    
    this.tenisService.getAtivos().subscribe({
      next: (tenis: Tenis[]) => {
        const termoLower = termo.toLowerCase().trim();
        
        if (termoLower === '') {
          this.resultados = tenis;
        } else {
          this.resultados = tenis.filter(t => 
            t.nome.toLowerCase().includes(termoLower) ||
            t.descricao.toLowerCase().includes(termoLower) ||
            t.material.toLowerCase().includes(termoLower) ||
            t.genero.toLowerCase().includes(termoLower)
          );
        }
        
        this.todosTenis = tenis;
        this.nenhumResultado = this.resultados.length === 0;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erro na pesquisa:', error);
        this.isLoading = false;
        this.nenhumResultado = true;
      }
    });
  }

  verDetalhes(tenis: Tenis): void {
    this.router.navigate(['/tenis', tenis.id]);
  }
}