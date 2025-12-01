import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TenisService } from '../../services/tenis.service';
import { Tenis } from '../../models/tenis.model';

interface ImagePreview {
  url: string;
  file: File;
}

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
  
  // Upload de múltiplas imagens
  imagensPreviews: ImagePreview[] = [];
  imagensExistentes: string[] = [];
  uploadProgress: number = 0;
  
  // Tamanhos disponíveis
  tamanhosDisponiveis: string[] = ['34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'];
  tamanhosSelecionados: string[] = [];

  constructor(
    private fb: FormBuilder,
    public tenisService: TenisService,
    private router: Router
  ) {
    this.tenisForm = this.createForm();
  }

  ngOnInit(): void {
    this.carregarTenis();
  }

  createForm(): FormGroup {
    return this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      descricao: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      preco: [0, [Validators.required, Validators.min(0.01), Validators.max(9999.99)]],
      genero: ['MASCULINO', [Validators.required]],
      material: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      tamanhos: [[], [Validators.required, Validators.minLength(1)]],
      ativo: [true],
      marcaId: [1, [Validators.required, Validators.min(1)]],
      modeloId: [1, [Validators.required, Validators.min(1)]],
      esporteId: [1, [Validators.required, Validators.min(1)]],
      corId: [1, [Validators.required, Validators.min(1)]],
      imagemUrl: [''] // Campo para URL da imagem
    });
  }

  carregarTenis(): void {
    this.isLoading = true;
    this.tenisService.getAll().subscribe({
      next: (tenis: Tenis[]) => {
        this.tenisList = tenis;
        this.isLoading = false;
        console.log('Tênis carregados:', tenis);
      },
      error: (error: any) => {
        console.error('Erro ao carregar tênis:', error);
        this.mensagem = 'Erro ao carregar lista de tênis: ' + error.message;
        this.isLoading = false;
      }
    });
  }

  // MÉTODOS PARA UPLOAD DE MÚLTIPLAS IMAGENS
  onFilesSelected(event: any): void {
    const files: FileList = event.target.files;
    
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validar tipo de arquivo
        if (!file.type.startsWith('image/')) {
          this.mensagem = `O arquivo "${file.name}" não é uma imagem válida.`;
          continue;
        }

        // Validar tamanho (máximo 10MB)
        if (file.size > 10 * 1024 * 1024) {
          this.mensagem = `A imagem "${file.name}" deve ter no máximo 10MB.`;
          continue;
        }

        // Criar preview
        const reader = new FileReader();
        reader.onload = () => {
          this.imagensPreviews.push({
            url: reader.result as string,
            file: file
          });
        };
        reader.readAsDataURL(file);
      }
      
      // Limpar o input para permitir selecionar os mesmos arquivos novamente
      event.target.value = '';
    }
  }

  removerPreview(index: number): void {
    this.imagensPreviews.splice(index, 1);
  }

  removerImagemExistente(imagemUrl: string): void {
    if (this.editMode && this.tenisEditId) {
      if (confirm('Tem certeza que deseja remover esta imagem?')) {
        this.tenisService.removerImagemEspecifica(this.tenisEditId, imagemUrl).subscribe({
          next: (tenisAtualizado: Tenis) => {
            this.imagensExistentes = this.imagensExistentes.filter(img => img !== imagemUrl);
            this.mensagem = 'Imagem removida com sucesso!';
            this.carregarTenis();
          },
          error: (error: any) => {
            this.mensagem = 'Erro ao remover imagem: ' + error.message;
          }
        });
      }
    }
  }

  limparImagens(): void {
    this.imagensPreviews = [];
    this.imagensExistentes = [];
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

  async onSubmit(): Promise<void> {
    if (this.tenisForm.valid && this.tamanhosSelecionados.length > 0) {
      this.isLoading = true;
      this.mensagem = '';
      
      // VALIDAR IDs ANTES DE ENVIAR
      const ids = {
        marcaId: parseInt(this.tenisForm.get('marcaId')?.value),
        modeloId: parseInt(this.tenisForm.get('modeloId')?.value),
        esporteId: parseInt(this.tenisForm.get('esporteId')?.value),
        corId: parseInt(this.tenisForm.get('corId')?.value)
      };

      // Verificar se todos os IDs são válidos
      const idsValidos = Object.values(ids).every(id => id && id > 0);
      if (!idsValidos) {
        this.mensagem = 'Erro: Todos os IDs (Marca, Modelo, Esporte, Cor) devem ser números maiores que zero';
        this.isLoading = false;
        return;
      }

      // Criar objeto com os dados do formulário
      const tenisData = {
        nome: this.tenisForm.get('nome')?.value,
        descricao: this.tenisForm.get('descricao')?.value,
        preco: parseFloat(this.tenisForm.get('preco')?.value),
        genero: this.tenisForm.get('genero')?.value,
        material: this.tenisForm.get('material')?.value,
        tamanhos: this.tamanhosSelecionados,
        ativo: this.tenisForm.get('ativo')?.value,
        imagemUrl: this.tenisForm.get('imagemUrl')?.value,
        ...ids
      };

      console.log('Dados validados sendo enviados:', tenisData);

      try {
        let tenisSalvo: Tenis;

        if (this.editMode && this.tenisEditId) {
          // Modo edição
          tenisSalvo = await this.tenisService.update(this.tenisEditId, tenisData as Tenis).toPromise() as Tenis;
          this.mensagem = `Tênis "${tenisSalvo.nome}" atualizado com sucesso!`;
        } else {
          // Modo criação
          try {
            tenisSalvo = await this.tenisService.create(tenisData).toPromise() as Tenis;
            this.mensagem = `Tênis "${tenisSalvo.nome}" cadastrado com sucesso!`;
          } catch (error: any) {
            console.log('Primeiro método falhou, tentando método com estrutura backend...');
            try {
              tenisSalvo = await this.tenisService.createComEstruturaBackend(tenisData).toPromise() as Tenis;
              this.mensagem = `Tênis "${tenisSalvo.nome}" cadastrado com sucesso (estrutura backend)!`;
            } catch (error2: any) {
              console.log('Método com estrutura backend falhou, tentando método com IDs fixos...');
              tenisSalvo = await this.tenisService.createComIDsFixos(tenisData).toPromise() as Tenis;
              this.mensagem = `Tênis "${tenisSalvo.nome}" cadastrado com sucesso (IDs fixos)!`;
            }
          }
        }

        // Upload de imagem APENAS se não houver URL e se houver arquivos selecionados
        const hasImageUrl = !!this.tenisForm.get('imagemUrl')?.value;
        if (!hasImageUrl && this.imagensPreviews.length > 0 && tenisSalvo && tenisSalvo.id) {
          // Faz upload apenas da primeira imagem
          await this.fazerUploadImagemSimples(tenisSalvo.id, this.imagensPreviews[0].file);
        }

        this.carregarTenis();
        if (this.editMode) {
          this.cancelarEdicao();
        } else {
          this.resetForm();
        }

      } catch (error: any) {
        console.error('Erro detalhado:', error);
        this.mensagem = `Erro ao ${this.editMode ? 'atualizar' : 'cadastrar'} tênis: ${error.message}`;
      } finally {
        this.isLoading = false;
      }
    } else {
      this.marcarCamposComoSujos();
      if (this.tamanhosSelecionados.length === 0) {
        this.mensagem = 'Selecione pelo menos um tamanho disponível.';
      } else {
        this.mensagem = 'Por favor, preencha todos os campos obrigatórios corretamente.';
      }
    }
  }

  // Método de upload simplificado
  private async fazerUploadImagemSimples(tenisId: number, file: File): Promise<void> {
    try {
      this.uploadProgress = 30;
      await this.tenisService.uploadImagem(tenisId, file).toPromise();
      this.uploadProgress = 100;
      this.mensagem += ' Imagem carregada com sucesso!';
      
      setTimeout(() => {
        this.imagensPreviews = [];
        this.uploadProgress = 0;
      }, 2000);
      
    } catch (error: any) {
      console.warn('Aviso ao carregar imagem:', error.message);
      this.uploadProgress = 0;
    }
  }

  // Método para tratar erro de carregamento de imagem
  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/placeholder-shoe.png';
    imgElement.onerror = null;
  }

  editarTenis(tenis: Tenis): void {
    this.editMode = true;
    this.tenisEditId = tenis.id || null;
    
    this.tamanhosSelecionados = tenis.tamanhos || [];
    this.imagensExistentes = tenis.imagensUrls || [];
    
    this.tenisForm.patchValue({
      nome: tenis.nome,
      descricao: tenis.descricao,
      preco: tenis.preco,
      genero: tenis.genero,
      material: tenis.material,
      tamanhos: this.tamanhosSelecionados,
      ativo: tenis.ativo !== undefined ? tenis.ativo : true,
      marcaId: tenis.marcaId,
      modeloId: tenis.modeloId,
      esporteId: tenis.esporteId,
      corId: tenis.corId,
      imagemUrl: tenis.imagemUrl || (tenis.imagensUrls && tenis.imagensUrls.length > 0 ? tenis.imagensUrls[0] : '')
    });
    
    window.scrollTo(0, 0);
  }

  excluirTenis(id: number | undefined, nome: string): void {
    if (!id) {
      this.mensagem = 'Erro: ID do tênis não encontrado';
      return;
    }

    if (confirm(`Tem certeza que deseja excluir o tênis "${nome}"?`)) {
      this.isLoading = true;
      this.tenisService.delete(id).subscribe({
        next: () => {
          this.mensagem = `Tênis "${nome}" excluído com sucesso!`;
          // Atualiza a lista imediatamente
          this.tenisList = this.tenisList.filter(tenis => tenis.id !== id);
          this.isLoading = false;
        },
        error: (error: any) => {
          this.mensagem = 'Erro ao excluir tênis: ' + error.message;
          this.isLoading = false;
        }
      });
    }
  }

  cancelarEdicao(): void {
    this.editMode = false;
    this.tenisEditId = null;
    this.tamanhosSelecionados = [];
    this.limparImagens();
    this.resetForm();
  }

  resetForm(): void {
    this.tamanhosSelecionados = [];
    this.limparImagens();
    this.tenisForm.reset({
      nome: '',
      descricao: '',
      preco: 0,
      genero: 'MASCULINO',
      material: '',
      tamanhos: [],
      ativo: true,
      marcaId: 1,
      modeloId: 1,
      esporteId: 1,
      corId: 1,
      imagemUrl: ''
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
  get imagemUrl() { return this.tenisForm.get('imagemUrl'); }
}