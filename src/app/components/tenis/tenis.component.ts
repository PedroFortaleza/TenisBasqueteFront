import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TenisService } from '../../services/tenis.service';
import { Tenis } from '../../models/tenis.model';

@Component({
  selector: 'app-tenis',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tenis.component.html',
  styleUrls: ['./tenis.component.css']
})
export class TenisComponent implements OnInit {
  tenis: Tenis | null = null;
  isLoading: boolean = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tenisService: TenisService
  ) {}

  ngOnInit(): void {
    this.carregarTenis();
  }

  carregarTenis(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.tenisService.getById(Number(id)).subscribe({
        next: (tenis: Tenis) => {
          this.tenis = tenis;
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Erro ao carregar tênis:', error);
          this.error = 'Tênis não encontrado';
          this.isLoading = false;
        }
      });
    } else {
      this.error = 'ID do tênis não informado';
      this.isLoading = false;
    }
  }

  voltarParaHome(): void {
    this.router.navigate(['/home']);
  }
}