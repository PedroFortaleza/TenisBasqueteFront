export interface Tenis {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  genero: string;
  material: string;
  tamanhos: string[]; 
  ativo: boolean;
  marcaId: number;
  modeloId: number;
  esporteId: number;
  corId: number;
}