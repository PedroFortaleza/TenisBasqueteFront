import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tenis',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tenis-container">
      <h1>Detalhes do Tênis</h1>
      <p>Página de detalhes do tênis em desenvolvimento...</p>
    </div>
  `
})
export class TenisComponent { }