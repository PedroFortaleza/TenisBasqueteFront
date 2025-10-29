import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  
  adicionarAoCarrinho(nome: string) {
    alert(`Adicionado ao carrinho: ${nome}`);
  }

  verDetalhes(nome: string) {
    alert(`Detalhes do: ${nome}`);
  }
}