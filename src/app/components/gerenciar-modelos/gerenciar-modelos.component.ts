import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ModeloService } from '../../services/modelo.service';
import { Modelo } from '../../models/modelo.model';

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
    const modelosSimples: ModeloSimples[] = [];

    modelosCompletos.forEach(modelo => {
      // CORREÇÃO: Determinar o status baseado na propriedade correta
      const estaAtivo = this.determinarStatusAtivo(modelo);
      
      modelosSimples.push({
        id: modelo.id,
        nome: modelo.nome,
        ativo: estaAtivo
      });
    });

    // Remover duplicados se necessário
    return this.removerDuplicados(modelosSimples);
  }

  private determinarStatusAtivo(modelo: Modelo): boolean {
    // Prioridade 1: usar a propriedade 'ativo' se existir
    if (modelo.ativo !== undefined) {
      return modelo.ativo;
    }
    
    // Prioridade 2: usar 'emEstoque' como fallback
    if (modelo.emEstoque !== undefined) {
      return modelo.emEstoque;
    }
    
    // Padrão: se não há informação, considerar como ativo
    return true;
  }

  private removerDuplicados(modelos: ModeloSimples[]): ModeloSimples[] {
    const nomesUnicos = new Set<string>();
    return modelos.filter(modelo => {
      if (nomesUnicos.has(modelo.nome)) {
        return false;
      }
      nomesUnicos.add(modelo.nome);
      return true;
    });
  }

  onSubmit(): void {
    if (this.modeloForm.valid) {
      this.isLoading = true;
      const formData = this.modeloForm.value;

      // CORREÇÃO: Criar modelo com propriedade ativo
      const modeloCompleto: Modelo = {
        id: this.editMode ? this.modeloEditId! : 0,
        nome: formData.nome,
        tamanho: '40',
        preco: 0,
        cor: 'Preto',
        emEstoque: true, // Para compatibilidade com backend
        ativo: formData.ativo // Nova propriedade
      };

      console.log('Enviando modelo:', modeloCompleto);

      const operacao = this.editMode && this.modeloEditId 
        ? this.modeloService.update(this.modeloEditId, modeloCompleto)
        : this.modeloService.create(modeloCompleto);

      operacao.subscribe({
        next: (modeloResultado) => {
          console.log('Resposta do servidor:', modeloResultado);
          this.mensagem = `Modelo "${modeloResultado.nome}" ${this.editMode ? 'atualizado' : 'cadastrado'} com sucesso!`;
          this.carregarModelos();
          if (this.editMode) {
            this.cancelarEdicao();
          } else {
            this.resetForm();
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erro completo:', error);
          this.mensagem = `Erro ao ${this.editMode ? 'atualizar' : 'cadastrar'} modelo: ${error.message || 'Erro desconhecido'}`;
          this.isLoading = false;
        }
      });
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
    
    // Scroll para o formulário
    document.querySelector('.form-section')?.scrollIntoView({ behavior: 'smooth' });
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