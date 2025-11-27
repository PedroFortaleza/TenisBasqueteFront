import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MarcaService } from '../../services/marca.service';
import { Marca } from '../../models/marca.model';

@Component({
  selector: 'app-gerenciar-marcas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gerenciar-marcas.component.html',
  styleUrls: ['./gerenciar-marcas.component.css']
})
export class GerenciarMarcasComponent implements OnInit {
  marcaForm: FormGroup;
  marcas: Marca[] = [];
  mensagem: string = '';
  isLoading: boolean = false;
  editMode: boolean = false;
  marcaEditId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private marcaService: MarcaService,
    private authService: AuthService,
    private router: Router
  ) {
    this.marcaForm = this.createForm();
  }

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/login']);
      return;
    }
    this.carregarMarcas();
  }

  createForm(): FormGroup {
    return this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      paisOrigem: ['', [Validators.maxLength(50)]],
      anofundacao: [null, [Validators.min(1800), Validators.max(2024)]],
      siteOficial: ['', [Validators.pattern(/^https?:\/\/.+\..+/)]],
      ativa: [true]
    });
  }

  carregarMarcas(): void {
    this.isLoading = true;
    this.marcaService.getAll().subscribe({
      next: (marcas) => {
        this.marcas = marcas;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar marcas:', error);
        this.mensagem = 'Erro ao carregar lista de marcas';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.marcaForm.valid) {
      this.isLoading = true;
      const marcaData: Marca = this.marcaForm.value;

      if (this.editMode && this.marcaEditId) {
        this.marcaService.update(this.marcaEditId, marcaData).subscribe({
          next: (marcaAtualizada) => {
            this.mensagem = `Marca "${marcaAtualizada.nome}" atualizada com sucesso!`;
            this.carregarMarcas();
            this.cancelarEdicao();
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Erro ao atualizar marca:', error);
            this.mensagem = 'Erro ao atualizar marca. Tente novamente.';
            this.isLoading = false;
          }
        });
      } else {
        this.marcaService.create(marcaData).subscribe({
          next: (marcaCriada) => {
            this.mensagem = `Marca "${marcaCriada.nome}" cadastrada com sucesso!`;
            this.carregarMarcas();
            this.resetForm();
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Erro ao cadastrar marca:', error);
            this.mensagem = 'Erro ao cadastrar marca. Tente novamente.';
            this.isLoading = false;
          }
        });
      }
    } else {
      this.marcaForm.markAllAsTouched();
    }
  }

  editarMarca(marca: Marca): void {
    this.editMode = true;
    this.marcaEditId = marca.id;
    this.marcaForm.patchValue({
      nome: marca.nome,
      paisOrigem: marca.paisOrigem,
      anofundacao: marca.anofundacao,
      siteOficial: marca.siteOficial,
      ativa: marca.ativa
    });
    this.mensagem = '';
  }

  excluirMarca(id: number, nome: string): void {
    if (confirm(`Tem certeza que deseja excluir a marca "${nome}"?`)) {
      this.marcaService.delete(id).subscribe({
        next: () => {
          this.mensagem = `Marca "${nome}" excluída com sucesso!`;
          this.carregarMarcas();
        },
        error: (error) => {
          console.error('Erro ao excluir marca:', error);
          this.mensagem = 'Erro ao excluir marca. Tente novamente.';
        }
      });
    }
  }

  cancelarEdicao(): void {
    this.editMode = false;
    this.marcaEditId = null;
    this.resetForm();
    this.mensagem = '';
  }

  resetForm(): void {
    this.marcaForm.reset({
      nome: '',
      paisOrigem: '',
      anofundacao: null,
      siteOficial: '',
      ativa: true
    });
    this.marcaForm.markAsPristine();
    this.marcaForm.markAsUntouched();
  }

  voltarParaGerenciamento(): void {
    this.router.navigate(['/gerenciamento-geral']);
  }

  get nome() { return this.marcaForm.get('nome'); }
  get siteOficial() { return this.marcaForm.get('siteOficial'); }
  get anofundacao() { return this.marcaForm.get('anofundacao'); }
}