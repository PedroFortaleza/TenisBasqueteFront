import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TenisService } from '../../services/tenis.service';
import { Tenis } from '../../models/tenis.model';

@Component({
  selector: 'app-gerenciar-tenis',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gerenciar-tenis.component.html',
  styleUrls: ['./gerenciar-tenis.component.css']
})
export class GerenciarTenisComponent implements OnInit {
  tenisForm: FormGroup;
  tenisList: Tenis[] = [];
  mensagem: string = '';
  isLoading: boolean = false;
  editMode: boolean = false;
  tenisEditId: number | null = null;
  
  // Tamanhos disponíveis
  tamanhosDisponiveis: string[] = ['34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'];
  tamanhosSelecionados: string[] = [];

  constructor(
    private fb: FormBuilder,
    private tenisService: TenisService,
    private router: Router
  ) {
    this.tenisForm = this.createForm();
  }

  ngOnInit(): void {
    this.carregarTenis();
  }

  createForm(): FormGroup {
    return this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      descricao: ['', [Validators.required, Validators.minLength(10)]],
      preco: [0, [Validators.required, Validators.min(0.01)]],
      genero: ['MASCULINO', Validators.required],
      material: ['', [Validators.required, Validators.minLength(3)]],
      tamanhos: [[], [Validators.required, Validators.minLength(1)]],
      ativo: [true],
      marcaId: [0, [Validators.required, Validators.min(1)]],
      modeloId: [0, [Validators.required, Validators.min(1)]],
      esporteId: [0, [Validators.required, Validators.min(1)]],
      corId: [0, [Validators.required, Validators.min(1)]]
    });
  }

  carregarTenis(): void {
    this.isLoading = true;
    this.tenisService.getAll().subscribe({
      next: (tenis: Tenis[]) => {
        this.tenisList = tenis;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar tênis:', error);
        this.mensagem = 'Erro ao carregar lista de tênis';
        this.isLoading = false;
      }
    });
  }

  // Método para lidar com a seleção/deseleção de tamanhos
  onTamanhoChange(event: any): void {
    const tamanho = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      this.tamanhosSelecionados.push(tamanho);
    } else {
      this.tamanhosSelecionados = this.tamanhosSelecionados.filter(t => t !== tamanho);
    }

    // Ordenar os tamanhos numericamente
    this.tamanhosSelecionados.sort((a, b) => parseInt(a) - parseInt(b));
    
    // Atualizar o valor do form control
    this.tenisForm.patchValue({
      tamanhos: this.tamanhosSelecionados
    });
    
    // Marcar como tocado para validação
    this.tenisForm.get('tamanhos')?.markAsTouched();
  }

  onSubmit(): void {
    if (this.tenisForm.valid && this.tamanhosSelecionados.length > 0) {
      this.isLoading = true;
      const tenisData: Tenis = this.tenisForm.value;

      if (this.editMode && this.tenisEditId) {
        // Modo edição
        this.tenisService.update(this.tenisEditId, tenisData).subscribe({
          next: (tenisAtualizado: Tenis) => {
            this.mensagem = `Tênis "${tenisAtualizado.nome}" atualizado com sucesso!`;
            this.carregarTenis();
            this.cancelarEdicao();
          },
          error: (error: any) => {
            this.mensagem = 'Erro ao atualizar tênis: ' + error.message;
            this.isLoading = false;
          }
        });
      } else {
        // Modo criação
        this.tenisService.create(tenisData).subscribe({
          next: (tenisCriado: Tenis) => {
            this.mensagem = `Tênis "${tenisCriado.nome}" cadastrado com sucesso!`;
            this.carregarTenis();
            this.resetForm();
          },
          error: (error: any) => {
            this.mensagem = 'Erro ao cadastrar tênis: ' + error.message;
            this.isLoading = false;
          }
        });
      }
    } else {
      this.marcarCamposComoSujos();
      if (this.tamanhosSelecionados.length === 0) {
        this.mensagem = 'Selecione pelo menos um tamanho disponível.';
      }
    }
  }

  editarTenis(tenis: Tenis): void {
    this.editMode = true;
    this.tenisEditId = tenis.id;
    
    // Preencher os tamanhos selecionados
    this.tamanhosSelecionados = tenis.tamanhos || [];
    
    this.tenisForm.patchValue({
      ...tenis,
      tamanhos: this.tamanhosSelecionados
    });
    
    window.scrollTo(0, 0);
  }

  excluirTenis(id: number, nome: string): void {
    if (confirm(`Tem certeza que deseja excluir o tênis "${nome}"?`)) {
      this.tenisService.delete(id).subscribe({
        next: () => {
          this.mensagem = `Tênis "${nome}" excluído com sucesso!`;
          this.carregarTenis();
        },
        error: (error: any) => {
          this.mensagem = 'Erro ao excluir tênis: ' + error.message;
        }
      });
    }
  }

  cancelarEdicao(): void {
    this.editMode = false;
    this.tenisEditId = null;
    this.tamanhosSelecionados = [];
    this.resetForm();
  }

  resetForm(): void {
    this.tamanhosSelecionados = [];
    this.tenisForm.reset({
      nome: '',
      descricao: '',
      preco: 0,
      genero: 'MASCULINO',
      material: '',
      tamanhos: [],
      ativo: true,
      marcaId: 0,
      modeloId: 0,
      esporteId: 0,
      corId: 0
    });
    this.tenisForm.markAsPristine();
    this.tenisForm.markAsUntouched();
  }

  marcarCamposComoSujos(): void {
    Object.keys(this.tenisForm.controls).forEach(key => {
      this.tenisForm.get(key)?.markAsTouched();
    });
  }

  irParaGerenciamentoGeral(): void {
    this.router.navigate(['/gerenciamento-geral']);
  }

  // Getters para validação no template
  get nome() { return this.tenisForm.get('nome'); }
  get descricao() { return this.tenisForm.get('descricao'); }
  get preco() { return this.tenisForm.get('preco'); }
  get material() { return this.tenisForm.get('material'); }
  get tamanhos() { return this.tenisForm.get('tamanhos'); }
  get marcaId() { return this.tenisForm.get('marcaId'); }
  get modeloId() { return this.tenisForm.get('modeloId'); }
  get esporteId() { return this.tenisForm.get('esporteId'); }
  get corId() { return this.tenisForm.get('corId'); }
}