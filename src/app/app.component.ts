import { Component, type OnInit } from "@angular/core"
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { AuthService } from "./services/auth.service"
import type { Usuario } from "./services/auth.service"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, FormsModule],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  title = "Fortal Tênis Esportivos"
  termoPesquisa = ""
  usuario: Usuario | null = null

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authService.usuarioAtual.subscribe((usuario) => {
      this.usuario = usuario
    })
  }

  pesquisar(): void {
    if (this.termoPesquisa.trim()) {
      this.router.navigate(["/pesquisa"], {
        queryParams: { q: this.termoPesquisa },
      })
      this.termoPesquisa = ""
    }
  }

  logout(): void {
    this.authService.logout()
  }

  irParaHome(): void {
    this.router.navigate(['/home']);
  }
}