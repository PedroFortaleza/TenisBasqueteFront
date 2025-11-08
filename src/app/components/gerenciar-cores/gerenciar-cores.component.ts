import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CorService } from '../../services/cor.service';
import { Cor } from '../../models/cor.model';

@Component({
  selector: 'app-gerenciar-cores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gerenciar-cores.component.html',
  styleUrls: ['./gerenciar-cores.component.css']
})
export class GerenciarCoresComponent implements OnInit {
  corForm: FormGroup;
  cores: Cor[] = [];
  mensagem: string = '';
  isLoading: boolean = false;
  editMode: boolean = false;
  corEditId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private corService: CorService,
    private authService: AuthService,
    private router: Router
  ) {
    this.corForm = this.createForm();
  }

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/login']);
      return;
    }
    this.carregarCores();
  }

  createForm(): FormGroup {
    return this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      codigoHex: ['', [Validators.required, Validators.pattern(/^#[0-9A-F]{6}$/i)]],
      ativo: [true]
    });
  }

  carregarCores(): void {
    this.isLoading = true;
    this.corService.getAll().subscribe({
      next: (cores) => {
        this.cores = cores;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar cores:', error);
        this.mensagem = 'Erro ao carregar lista de cores';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.corForm.valid) {
      this.isLoading = true;
      const corData: Cor = this.corForm.value;

      // Garantir que o código hex esteja em maiúsculas
      corData.codigoHex = corData.codigoHex.toUpperCase();

      if (this.editMode && this.corEditId) {
        // Modo edição
        this.corService.update(this.corEditId, corData).subscribe({
          next: (corAtualizada) => {
            this.mensagem = `Cor "${corAtualizada.nome}" atualizada com sucesso!`;
            this.carregarCores();
            this.cancelarEdicao();
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Erro ao atualizar cor:', error);
            this.mensagem = 'Erro ao atualizar cor. Tente novamente.';
            this.isLoading = false;
          }
        });
      } else {
        // Modo cadastro
        this.corService.create(corData).subscribe({
          next: (corCriada) => {
            this.mensagem = `Cor "${corCriada.nome}" cadastrada com sucesso!`;
            this.carregarCores();
            this.resetForm();
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Erro ao cadastrar cor:', error);
            this.mensagem = 'Erro ao cadastrar cor. Tente novamente.';
            this.isLoading = false;
          }
        });
      }
    } else {
      // Marcar todos os campos como touched para mostrar erros
      this.corForm.markAllAsTouched();
    }
  }

  editarCor(cor: Cor): void {
    this.editMode = true;
    this.corEditId = cor.id!;
    this.corForm.patchValue({
      nome: cor.nome,
      codigoHex: cor.codigoHex,
      ativo: cor.ativo
    });
    this.mensagem = ''; // Limpar mensagens anteriores
  }

  excluirCor(id: number, nome: string): void {
    if (confirm(`Tem certeza que deseja excluir a cor "${nome}"?`)) {
      this.corService.delete(id).subscribe({
        next: () => {
          this.mensagem = `Cor "${nome}" excluída com sucesso!`;
          this.carregarCores();
        },
        error: (error) => {
          console.error('Erro ao excluir cor:', error);
          this.mensagem = 'Erro ao excluir cor. Tente novamente.';
        }
      });
    }
  }

  cancelarEdicao(): void {
    this.editMode = false;
    this.corEditId = null;
    this.resetForm();
    this.mensagem = '';
  }

  resetForm(): void {
    this.corForm.reset({
      nome: '',
      codigoHex: '',
      ativo: true
    });
    this.corForm.markAsPristine();
    this.corForm.markAsUntouched();
  }

  voltarParaGerenciamento(): void {
    this.router.navigate(['/gerenciamento-geral']);
  }

  // Getters para os controles do formulário
  get nome() { return this.corForm.get('nome'); }
  get codigoHex() { return this.corForm.get('codigoHex'); }

  getContrastColor(hexColor: string): string {
    // Função para determinar cor do texto baseado no fundo
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  }
}