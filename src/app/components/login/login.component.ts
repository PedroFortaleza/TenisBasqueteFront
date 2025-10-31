import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  mensagemErro: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.mensagemErro = '';

      const { email, senha } = this.loginForm.value;

      // Simula delay de rede
      setTimeout(() => {
        const loginSucesso = this.authService.login(email, senha);
        
        if (loginSucesso) {
          this.router.navigate(['/perfil']);
        } else {
          this.mensagemErro = 'Email ou senha inválidos!';
        }
        
        this.isLoading = false;
      }, 1000);
    } else {
      this.marcarCamposComoSujos();
    }
  }

  private marcarCamposComoSujos(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }

  // Credenciais de teste - Agora com seu usuário real
  preencherCredenciaisAdmin(): void {
    this.loginForm.patchValue({
      email: 'pedrofortal@example.com',
      senha: '123456'
    });
  }

  get email() { return this.loginForm.get('email'); }
  get senha() { return this.loginForm.get('senha'); }
}