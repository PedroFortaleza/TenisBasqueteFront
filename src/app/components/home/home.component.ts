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

    // Primeiro tenta carregar produtos ativos
    this.tenisService.getAtivos().subscribe({
      next: (tenis: Tenis[]) => {
        if (tenis.length > 0) {
          // Se encontrou produtos ativos, usa eles
          this.featuredProducts = tenis.slice(0, 9)
          console.log('Produtos ativos carregados:', this.featuredProducts)
          
          // 🔥 DEBUG: Verificar imagens de cada produto
          this.featuredProducts.forEach((produto, index) => {
            console.log(`Produto ${index + 1}:`, {
              nome: produto.nome,
              imagemUrl: produto.imagemUrl,
              imagensUrls: produto.imagensUrls,
              temImagem: this.tenisService.temImagem(produto),
              imagemPrincipal: this.tenisService.getImagemPrincipal(produto)
            })
          })
        } else {
          // Se não encontrou produtos ativos, tenta carregar todos
          this.tenisService.getAll().subscribe({
            next: (todosTenis: Tenis[]) => {
              // Filtra apenas produtos ativos ou usa todos se não houver filtro
              this.featuredProducts = todosTenis
                .filter(produto => produto.ativo === true || produto.ativo === undefined)
                .slice(0, 9)
              console.log('Produtos carregados (fallback):', this.featuredProducts)
            },
            error: (error: any) => {
              console.error("Erro ao carregar todos os produtos:", error)
              this.featuredProducts = []
            }
          })
        }
        this.isLoading = false
      },
      error: (error: any) => {
        console.error("Erro ao carregar produtos ativos:", error)
        // Se falhar, tenta carregar todos os produtos
        this.tenisService.getAll().subscribe({
          next: (todosTenis: Tenis[]) => {
            this.featuredProducts = todosTenis.slice(0, 9)
            console.log('Produtos carregados (fallback):', this.featuredProducts)
            this.isLoading = false
          },
          error: (error2: any) => {
            console.error("Erro também ao carregar todos os produtos:", error2)
            this.featuredProducts = []
            this.isLoading = false
          }
        })
      },
    })
  }

  // 🔥 MÉTODO MELHORADO: Obter imagem do produto
  getProductImage(product: Tenis): string {
    return this.tenisService.getImagemPrincipal(product);
  }

  // 🔥 MÉTODO MELHORADO: Verificar se produto tem imagem
  hasProductImage(product: Tenis): boolean {
    return this.tenisService.temImagem(product);
  }

  // 🔥 MÉTODO MELHORADO: Tratar erro de carregamento de imagem
  handleImageError(event: any, product: Tenis): void {
    console.warn(`Erro ao carregar imagem do produto ${product.nome}:`, event);
    
    const target = event.target as HTMLImageElement;
    
    // Tentar usar imagemUrl se imagensUrls falhou
    if (product.imagemUrl && target.src !== product.imagemUrl) {
      console.log(`Tentando imagemUrl alternativa: ${product.imagemUrl}`);
      target.src = product.imagemUrl;
      return;
    }
    
    // Se ambas falharem, mostrar placeholder
    target.style.display = 'none';
    const parent = target.parentElement;
    if (parent) {
      const placeholder = parent.querySelector('.no-image') as HTMLElement;
      if (placeholder) {
        placeholder.style.display = 'flex';
      }
    }
  }

  // 🔥 MÉTODO: Quando imagem carrega com sucesso
  handleImageLoad(event: any, product: Tenis): void {
    console.log(`Imagem carregada com sucesso para ${product.nome}`);
    const target = event.target as HTMLImageElement;
    target.style.display = 'block';
    
    // Esconder placeholder
    const parent = target.parentElement;
    if (parent) {
      const placeholder = parent.querySelector('.no-image') as HTMLElement;
      if (placeholder) {
        placeholder.style.display = 'none';
      }
    }
  }

  verDetalhes(product: Tenis): void {
    if (product.id) {
      this.router.navigate(["/tenis", product.id])
    } else {
      console.error('Produto sem ID:', product)
    }
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