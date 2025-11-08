export interface Modelo {
  id?: number;
  nome: string;
  tamanho: string;
  preco: number;
  cor: string;
  emEstoque: boolean;
  ativo?: boolean; 
}