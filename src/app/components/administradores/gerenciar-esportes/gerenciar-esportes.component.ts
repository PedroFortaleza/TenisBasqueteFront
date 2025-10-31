import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { EsporteService } from '../../../services/esporte.service';
import { Esporte } from '../../../models/esporte.model';

@Component({
  selector: 'app-gerenciar-esportes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gerenciar-esportes.component.html',
  styleUrls: ['./gerenciar-esportes.component.css']
})
export class GerenciarEsportesComponent implements OnInit {
  esporteForm: FormGroup;
  esportes: Esporte[] = [];
  mensagem: string = '';
  isLoading: boolean = false;
  editMode: boolean = false;
  esporteEditId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private esporteService: EsporteService,
    private authService: AuthService,
    private router: Router
  ) {
    this.esporteForm = this.createForm();
  }

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/login']);
      return;
    }
    this.carregarEsportes();
  }

  createForm(): FormGroup {
    return this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      descricao: ['', [Validators.maxLength(500)]],
      ativo: [true]
    });
  }

  carregarEsportes(): void {
    this.isLoading = true;
    this.esporteService.getAll().subscribe({
      next: (esportes) => {
        this.esportes = esportes;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar esportes:', error);
        this.mensagem = 'Erro ao carregar lista de esportes';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.esporteForm.valid) {
      this.isLoading = true;
      const esporteData: Esporte = this.esporteForm.value;

      if (this.editMode && this.esporteEditId) {
        this.esporteService.update(this.esporteEditId, esporteData).subscribe({
          next: (esporteAtualizado) => {
            this.mensagem = `Esporte "${esporteAtualizado.nome}" atualizado com sucesso!`;
            this.carregarEsportes();
            this.cancelarEdicao();
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Erro ao atualizar esporte:', error);
            this.mensagem = 'Erro ao atualizar esporte. Tente novamente.';
            this.isLoading = false;
          }
        });
      } else {
        this.esporteService.create(esporteData).subscribe({
          next: (esporteCriado) => {
            this.mensagem = `Esporte "${esporteCriado.nome}" cadastrado com sucesso!`;
            this.carregarEsportes();
            this.resetForm();
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Erro ao cadastrar esporte:', error);
            this.mensagem = 'Erro ao cadastrar esporte. Tente novamente.';
            this.isLoading = false;
          }
        });
      }
    } else {
      this.esporteForm.markAllAsTouched();
    }
  }

  editarEsporte(esporte: Esporte): void {
    this.editMode = true;
    this.esporteEditId = esporte.id;
    this.esporteForm.patchValue({
      nome: esporte.nome,
      descricao: esporte.descricao,
      ativo: esporte.ativo
    });
    this.mensagem = '';
  }

  excluirEsporte(id: number, nome: string): void {
    if (confirm(`Tem certeza que deseja excluir o esporte "${nome}"?`)) {
      this.esporteService.delete(id).subscribe({
        next: () => {
          this.mensagem = `Esporte "${nome}" excluído com sucesso!`;
          this.carregarEsportes();
        },
        error: (error) => {
          console.error('Erro ao excluir esporte:', error);
          this.mensagem = 'Erro ao excluir esporte. Tente novamente.';
        }
      });
    }
  }

  cancelarEdicao(): void {
    this.editMode = false;
    this.esporteEditId = null;
    this.resetForm();
    this.mensagem = '';
  }

  resetForm(): void {
    this.esporteForm.reset({
      nome: '',
      descricao: '',
      ativo: true
    });
    this.esporteForm.markAsPristine();
    this.esporteForm.markAsUntouched();
  }

  voltarParaGerenciamento(): void {
    this.router.navigate(['/gerenciamento-geral']);
  }

  get nome() { return this.esporteForm.get('nome'); }
}