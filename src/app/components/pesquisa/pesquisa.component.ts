import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pesquisa',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pesquisa-container">
      <h1>Resultados da Pesquisa</h1>
      <p>Funcionalidade de pesquisa em desenvolvimento...</p>
    </div>
  `
})
export class PesquisaComponent { }