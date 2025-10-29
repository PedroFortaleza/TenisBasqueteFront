import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];

  ngOnInit() {
    this.featuredProducts = [
      {
        id: 1,
        name: 'Tênis Performance Pro',
        price: 299.90,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop'
      },
      {
        id: 2,
        name: 'Tênis Speed Runner',
        price: 349.90,
        image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop'
      },
      {
        id: 3,
        name: 'Tênis Ultra Comfort',
        price: 279.90,
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=300&fit=crop'
      },
      {
        id: 4,
        name: 'Tênis Elite Training',
        price: 399.90,
        image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=300&fit=crop'
      }
    ];
  }
}