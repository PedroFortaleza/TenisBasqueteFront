import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ModeloService } from '../../../services/modelo.service';
import { Modelo } from '../../../models/modelo.model';

interface ModeloSimples {
  id?: number;
  nome: string;
  ativo: boolean;
}

@Component({
  selector: 'app-gerenciar-modelos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gerenciar-modelos.component.html',
  styleUrls: ['./gerenciar-modelos.component.css']
})
export class GerenciarModelosComponent implements OnInit {
  modeloForm: FormGroup;
  modelos: ModeloSimples[] = [];
  mensagem: string = '';
  isLoading: boolean = false;
  editMode: boolean = false;
  modeloEditId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private modeloService: ModeloService,
    private authService: AuthService,
    private router: Router
  ) {
    this.modeloForm = this.createForm();
  }

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/login']);
      return;
    }
    this.carregarModelos();
  }

  createForm(): FormGroup {
    return this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      ativo: [true]
    });
  }

  carregarModelos(): void {
    this.isLoading = true;
    
    this.modeloService.getAll().subscribe({
      next: (modelos: Modelo[]) => {
        console.log('Modelos carregados do servidor:', modelos);
        this.modelos = this.transformarEmModelosSimples(modelos);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar modelos:', error);
        this.mensagem = 'Erro ao carregar modelos do servidor';
        this.isLoading = false;
      }
    });
  }

  private transformarEmModelosSimples(modelosCompletos: Modelo[]): ModeloSimples[] {
    const nomesUnicos = new Set<string>();
    const modelosSimples: ModeloSimples[] = [];

    modelosCompletos.forEach(modelo => {
      if (!nomesUnicos.has(modelo.nome)) {
        nomesUnicos.add(modelo.nome);
        modelosSimples.push({
          id: modelo.id,
          nome: modelo.nome,
          ativo: modelo.emEstoque
        });
      }
    });

    return modelosSimples;
  }

  onSubmit(): void {
    if (this.modeloForm.valid) {
      this.isLoading = true;
      const formData = this.modeloForm.value;

      // CRIAR MODELO COMPLETO para o backend
      const modeloCompleto: Modelo = {
        id: this.editMode ? this.modeloEditId! : 0,
        nome: formData.nome,
        tamanho: '40',
        preco: 0,
        cor: 'Preto',
        emEstoque: formData.ativo
      };

      console.log('Enviando para o servidor:', modeloCompleto);

      if (this.editMode && this.modeloEditId) {
        this.modeloService.update(this.modeloEditId, modeloCompleto).subscribe({
          next: (modeloAtualizado) => {
            console.log('Resposta do servidor (update):', modeloAtualizado);
            this.mensagem = `Modelo "${modeloAtualizado.nome}" atualizado com sucesso!`;
            this.carregarModelos();
            this.cancelarEdicao();
            this.isLoading = false;
          },
          error: (error) => {
            console.error('ERRO COMPLETO (update):', error);
            console.error('Status:', error.status);
            console.error('Mensagem:', error.message);
            console.error('Error body:', error.error);
            this.mensagem = `Erro ao atualizar modelo: ${error.status} - ${error.message}. Verifique o console.`;
            this.isLoading = false;
          }
        });
      } else {
        this.modeloService.create(modeloCompleto).subscribe({
          next: (modeloCriado) => {
            console.log('Resposta do servidor (create):', modeloCriado);
            this.mensagem = `Modelo "${modeloCriado.nome}" cadastrado com sucesso!`;
            this.carregarModelos();
            this.resetForm();
            this.isLoading = false;
          },
          error: (error) => {
            console.error('ERRO COMPLETO (create):', error);
            console.error('Status:', error.status);
            console.error('Mensagem:', error.message);
            console.error('Error body:', error.error);
            this.mensagem = `Erro ao cadastrar modelo: ${error.status} - ${error.message}. Verifique o console.`;
            this.isLoading = false;
          }
        });
      }
    } else {
      this.modeloForm.markAllAsTouched();
    }
  }

  editarModelo(modelo: ModeloSimples): void {
    this.editMode = true;
    this.modeloEditId = modelo.id!;
    this.modeloForm.patchValue({
      nome: modelo.nome,
      ativo: modelo.ativo
    });
    this.mensagem = '';
  }

  excluirModelo(id: number, nome: string): void {
    if (confirm(`Tem certeza que deseja excluir o modelo "${nome}"?`)) {
      this.modeloService.delete(id).subscribe({
        next: () => {
          this.mensagem = `Modelo "${nome}" excluído com sucesso!`;
          this.carregarModelos();
        },
        error: (error) => {
          console.error('Erro ao excluir modelo:', error);
          this.mensagem = 'Erro ao excluir modelo. Tente novamente.';
        }
      });
    }
  }

  cancelarEdicao(): void {
    this.editMode = false;
    this.modeloEditId = null;
    this.resetForm();
    this.mensagem = '';
  }

  resetForm(): void {
    this.modeloForm.reset({
      nome: '',
      ativo: true
    });
  }

  voltarParaGerenciamento(): void {
    this.router.navigate(['/gerenciamento-geral']);
  }

  get nome() { return this.modeloForm.get('nome'); }
}