import { Component, type OnInit, type AfterViewInit, type ElementRef, ViewChild } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router } from "@angular/router"
import { TenisService } from "../../services/tenis.service"
import type { Tenis } from "../../models/tenis.model"

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit, AfterViewInit {
  featuredProducts: Tenis[] = []
  isLoading = true

  @ViewChild("productsSection") productsSection!: ElementRef

  constructor(
    private tenisService: TenisService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.carregarProdutosDestaque()
  }

  ngAfterViewInit(): void {
    this.setupScrollAnimations()
  }

  carregarProdutosDestaque(): void {
    this.isLoading = true

    // Use getAtivos() para carregar apenas tênis ativos
    this.tenisService.getAtivos().subscribe({
      next: (tenis: Tenis[]) => {
        // Filtrar apenas produtos ativos (segurança extra)
        this.featuredProducts = tenis.filter((produto) => produto.ativo === true)
        this.isLoading = false
      },
      error: (error: any) => {
        console.error("Erro ao carregar produtos:", error)
        this.featuredProducts = []
        this.isLoading = false
      },
    })
  }

  verDetalhes(product: Tenis): void {
    // Navega para o componente tenis passando o ID como parâmetro
    this.router.navigate(["/tenis", product.id])
  }

  scrollToProducts(): void {
    if (this.productsSection) {
      this.productsSection.nativeElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  private setupScrollAnimations(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    // Observa elementos com classe animate-on-scroll
    const elements = document.querySelectorAll(".animate-on-scroll")
    elements.forEach((el) => observer.observe(el))
  }
}