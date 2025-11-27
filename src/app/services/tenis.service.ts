import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Tenis } from '../models/tenis.model';

@Injectable({
  providedIn: 'root'
})
export class TenisService {
  private apiUrl = 'http://localhost:8080/tenis';

  constructor(private http: HttpClient) { }

  // MÉTODOS BÁSICOS DO CRUD
  getAll(): Observable<Tenis[]> {
    return this.http.get<Tenis[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<Tenis> {
    return this.http.get<Tenis>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // MÉTODO CREATE CORRIGIDO - ESTRUTURA BACKEND
  create(tenis: any): Observable<Tenis> {
    const tenisData = {
      nome: tenis.nome || '',
      descricao: tenis.descricao || '',
      preco: this.formatarPreco(tenis.preco || 0),
      genero: tenis.genero || 'MASCULINO',
      material: tenis.material || '',
      tamanhos: tenis.tamanhos || [],
      ativo: tenis.ativo !== undefined ? tenis.ativo : true,
      imagemUrl: tenis.imagemUrl || '',
      // ESTRUTURA QUE O BACKEND ESPERA
      corId: tenis.corId || 1,
      esporteId: tenis.esporteId || 1,
      marcaId: tenis.marcaId || 1,
      modeloId: tenis.modeloId || 1
    };

    console.log('Enviando dados para criação:', tenisData);
    
    return this.http.post<Tenis>(this.apiUrl, tenisData).pipe(
      catchError(this.handleError)
    );
  }

  // MÉTODO ALTERNATIVO COM OBJETOS ANINHADOS
  createComEstruturaBackend(tenis: any): Observable<Tenis> {
    const tenisData = {
      nome: tenis.nome || '',
      descricao: tenis.descricao || '',
      preco: this.formatarPreco(tenis.preco || 0),
      genero: tenis.genero || 'MASCULINO',
      material: tenis.material || '',
      tamanhos: tenis.tamanhos || [],
      ativo: tenis.ativo !== undefined ? tenis.ativo : true,
      imagemUrl: tenis.imagemUrl || '',
      // ESTRUTURA COM OBJETOS ANINHADOS
      cor: { id: tenis.corId || 1 },
      esporte: { id: tenis.esporteId || 1 },
      marca: { id: tenis.marcaId || 1 },
      modelo: { id: tenis.modeloId || 1 }
    };

    console.log('Enviando dados (estrutura backend):', tenisData);
    
    return this.http.post<Tenis>(this.apiUrl, tenisData).pipe(
      catchError(this.handleError)
    );
  }

  // MÉTODO COM IDs FIXOS PARA TESTE
  createComIDsFixos(tenis: any): Observable<Tenis> {
    const dadosComIDsFixos = {
      nome: tenis.nome || 'Tênis Teste',
      descricao: tenis.descricao || 'Descrição teste',
      preco: this.formatarPreco(tenis.preco || 100),
      genero: tenis.genero || 'MASCULINO',
      material: tenis.material || 'Couro',
      tamanhos: tenis.tamanhos || ['40', '41', '42'],
      ativo: true,
      imagemUrl: tenis.imagemUrl || '',
      // IDs FIXOS para teste
      corId: 1,
      esporteId: 1,
      marcaId: 1,
      modeloId: 1
    };

    console.log('Enviando com IDs fixos:', dadosComIDsFixos);
    
    return this.http.post<Tenis>(this.apiUrl, dadosComIDsFixos).pipe(
      catchError(this.handleError)
    );
  }

  // MÉTODO PARA FORMATAR PREÇO
  private formatarPreco(preco: any): number {
    if (typeof preco === 'string') {
      // Remove caracteres não numéricos e substitui vírgula por ponto
      const precoLimpo = preco.replace(/[^\d,]/g, '').replace(',', '.');
      return parseFloat(precoLimpo) || 0;
    }
    return Number(preco) || 0;
  }

  update(id: number, tenis: Tenis): Observable<Tenis> {
    const tenisData = {
      nome: tenis.nome,
      descricao: tenis.descricao,
      preco: tenis.preco,
      genero: tenis.genero,
      material: tenis.material,
      tamanhos: tenis.tamanhos,
      ativo: tenis.ativo,
      imagemUrl: tenis.imagemUrl || (tenis.imagensUrls && tenis.imagensUrls.length > 0 ? tenis.imagensUrls[0] : ''),
      corId: tenis.corId,
      esporteId: tenis.esporteId,
      marcaId: tenis.marcaId,
      modeloId: tenis.modeloId
    };

    console.log('Enviando dados para atualização:', tenisData);
    
    return this.http.put<Tenis>(`${this.apiUrl}/${id}`, tenisData).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // 🔥 MÉTODOS PARA UPLOAD DE IMAGENS - CORRIGIDOS
  uploadImagem(tenisId: number, file: File): Observable<Tenis> {
    const formData = new FormData();
    formData.append('file', file);
    
    // 🔥 ENDPOINT CORRETO: upload-imagem (singular)
    return this.http.post<Tenis>(`${this.apiUrl}/${tenisId}/upload-imagem`, formData).pipe(
      catchError(this.handleError)
    );
  }

  // 🔥 REMOVER MÉTODO QUE NÃO EXISTE NO BACKEND
  // uploadImagens(tenisId: number, files: File[]): Observable<Tenis> {
  //   const formData = new FormData();
  //   files.forEach(file => {
  //     formData.append('files', file);
  //   });
  //   return this.http.post<Tenis>(`${this.apiUrl}/${tenisId}/upload-imagens`, formData).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  // MÉTODOS PARA REMOVER IMAGENS
  removerImagem(tenisId: number): Observable<Tenis> {
    return this.http.delete<Tenis>(`${this.apiUrl}/${tenisId}/imagem`).pipe(
      catchError(this.handleError)
    );
  }

  removerImagemEspecifica(tenisId: number, imagemUrl: string): Observable<Tenis> {
    return this.http.delete<Tenis>(`${this.apiUrl}/${tenisId}/imagem-especifica`, {
      body: { imagemUrl }
    }).pipe(
      catchError(this.handleError)
    );
  }

  // MÉTODOS DE ATIVAÇÃO/DESATIVAÇÃO
  ativar(id: number): Observable<Tenis> {
    return this.http.patch<Tenis>(`${this.apiUrl}/${id}/ativar`, {}).pipe(
      catchError(this.handleError)
    );
  }

  desativar(id: number): Observable<Tenis> {
    return this.http.patch<Tenis>(`${this.apiUrl}/${id}/desativar`, {}).pipe(
      catchError(this.handleError)
    );
  }

  // MÉTODOS DE BUSCA E FILTROS
  getByMarca(marcaId: number): Observable<Tenis[]> {
    return this.http.get<Tenis[]>(`${this.apiUrl}/marca/${marcaId}`).pipe(
      catchError(this.handleError)
    );
  }

  getByEsporte(esporteId: number): Observable<Tenis[]> {
    return this.http.get<Tenis[]>(`${this.apiUrl}/esporte/${esporteId}`).pipe(
      catchError(this.handleError)
    );
  }

  getByGenero(genero: string): Observable<Tenis[]> {
    return this.http.get<Tenis[]>(`${this.apiUrl}/genero/${genero}`).pipe(
      catchError(this.handleError)
    );
  }

  getAtivos(): Observable<Tenis[]> {
    return this.http.get<Tenis[]>(`${this.apiUrl}/ativos`).pipe(
      catchError(this.handleError)
    );
  }

  getByTamanho(tamanho: string): Observable<Tenis[]> {
    return this.http.get<Tenis[]>(`${this.apiUrl}/tamanho/${tamanho}`).pipe(
      catchError(this.handleError)
    );
  }

  getByMaterial(material: string): Observable<Tenis[]> {
    return this.http.get<Tenis[]>(`${this.apiUrl}/material/${material}`).pipe(
      catchError(this.handleError)
    );
  }

  searchByNome(nome: string): Observable<Tenis[]> {
    return this.http.get<Tenis[]>(`${this.apiUrl}/search/${nome}`).pipe(
      catchError(this.handleError)
    );
  }

  // MÉTODOS PARA PRODUTOS EM DESTAQUE
  getDestaques(limit: number = 10): Observable<Tenis[]> {
    return this.http.get<Tenis[]>(`${this.apiUrl}/destaques?limit=${limit}`).pipe(
      catchError(this.handleError)
    );
  }

  getRecentes(limit: number = 10): Observable<Tenis[]> {
    return this.http.get<Tenis[]>(`${this.apiUrl}/recentes?limit=${limit}`).pipe(
      catchError(this.handleError)
    );
  }

  // MÉTODO PARA FILTROS AVANÇADOS
  getComFiltros(filtros: any): Observable<Tenis[]> {
    let params = new HttpParams();
    
    if (filtros.nome) params = params.append('nome', filtros.nome);
    if (filtros.genero) params = params.append('genero', filtros.genero);
    if (filtros.corId) params = params.append('corId', filtros.corId.toString());
    if (filtros.esporteId) params = params.append('esporteId', filtros.esporteId.toString());
    if (filtros.tamanho) params = params.append('tamanho', filtros.tamanho);
    if (filtros.material) params = params.append('material', filtros.material);
    if (filtros.ativo !== undefined) params = params.append('ativo', filtros.ativo.toString());
    if (filtros.precoMin) params = params.append('min', filtros.precoMin.toString());
    if (filtros.precoMax) params = params.append('max', filtros.precoMax.toString());
    
    return this.http.get<Tenis[]>(`${this.apiUrl}/filtros`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  // MÉTODO ESPECÍFICO PARA FAIXA DE PREÇO
  getPorFaixaPreco(precoMin: number, precoMax: number): Observable<Tenis[]> {
    return this.http.get<Tenis[]>(`${this.apiUrl}/preco?min=${precoMin}&max=${precoMax}`).pipe(
      catchError(this.handleError)
    );
  }

  // MÉTODOS PARA BUSCA COMBINADA
  getByCorAndEsporte(corId: number, esporteId: number): Observable<Tenis[]> {
    return this.http.get<Tenis[]>(`${this.apiUrl}/cor-esporte?corId=${corId}&esporteId=${esporteId}`).pipe(
      catchError(this.handleError)
    );
  }

  getByGeneroAndEsporte(genero: string, esporteId: number): Observable<Tenis[]> {
    return this.http.get<Tenis[]>(`${this.apiUrl}/genero-esporte?genero=${genero}&esporteId=${esporteId}`).pipe(
      catchError(this.handleError)
    );
  }

  // MÉTODOS PARA ESTATÍSTICAS E INFORMACOES
  getCount(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/count`).pipe(
      catchError(this.handleError)
    );
  }

  getGeneros(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/generos`).pipe(
      catchError(this.handleError)
    );
  }

  getEstatisticas(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/estatisticas/completas`).pipe(
      catchError(this.handleError)
    );
  }

  // MÉTODOS PARA TAMANHOS
  getTamanhosDisponiveis(): string[] {
    return ['34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'];
  }

  // MÉTODO PARA VALIDAÇÃO DE NOME
  verificarNomeExistente(nome: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/verificar-nome/${nome}`).pipe(
      catchError(this.handleError)
    );
  }

  // 🔥 NOVO MÉTODO: Buscar imagem principal do tênis
  getImagemPrincipal(tenis: Tenis): string {
    if (tenis.imagensUrls && tenis.imagensUrls.length > 0) {
      return tenis.imagensUrls[0];
    }
    return tenis.imagemUrl || 'assets/images/placeholder-shoe.png';
  }

  // 🔥 NOVO MÉTODO: Verificar se tem imagem
  temImagem(tenis: Tenis): boolean {
    return !!(tenis.imagemUrl || (tenis.imagensUrls && tenis.imagensUrls.length > 0));
  }

  // TRATAMENTO DE ERRO MELHORADO
  private handleError(error: any) {
    console.error('Erro completo na requisição:', error);
    
    let errorMessage = 'Erro desconhecido';
    let detalhes = '';
    
    if (error.error instanceof ErrorEvent) {
      // Erro do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do servidor
      errorMessage = `Erro ${error.status}: ${error.error?.message || error.message}`;
      
      // Adiciona detalhes específicos para erro 400
      if (error.status === 400) {
        detalhes = error.error?.erro || error.error || 'Dados inválidos enviados para o servidor';
        console.log('Detalhes do erro 400:', detalhes);
      }
      
      // Adiciona detalhes específicos para erro 404
      if (error.status === 404) {
        detalhes = 'Endpoint não encontrado. Verifique a URL.';
        console.log('Endpoint não encontrado:', error.url);
      }
    }
    
    const erroCompleto = detalhes ? `${errorMessage} - ${detalhes}` : errorMessage;
    return throwError(() => new Error(erroCompleto));
  }
}