import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { EsporteComponent } from './components/esporte/esporte.component';
import { CarrinhoComponent } from './components/carrinho/carrinho.component';
import { TenisComponent } from './components/tenis/tenis.component';
import { PesquisaComponent } from './components/pesquisa/pesquisa.component';
import { LoginComponent } from './components/login/login.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { GerenciamentoGeralComponent } from './components/gerenciamento-geral/gerenciamento-geral.component';
import { GerenciarMarcasComponent } from './components/gerenciar-marcas/gerenciar-marcas.component';
import { GerenciarModelosComponent } from './components/gerenciar-modelos/gerenciar-modelos.component';
import { GerenciarCoresComponent } from './components/gerenciar-cores/gerenciar-cores.component';
import { GerenciarEsportesComponent } from './components/gerenciar-esportes/gerenciar-esportes.component';
import { GerenciarTenisComponent } from './components/gerenciar-tenis/gerenciar-tenis.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'esporte', component: EsporteComponent },
  { path: 'carrinho', component: CarrinhoComponent },
  { path: 'tenis/:id', component: TenisComponent }, // ← COM PARÂMETRO ID
  { path: 'pesquisa', component: PesquisaComponent },
  { path: 'login', component: LoginComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'gerenciamento-geral', component: GerenciamentoGeralComponent },
  { path: 'gerenciar-marcas', component: GerenciarMarcasComponent },
  { path: 'gerenciar-modelos', component: GerenciarModelosComponent },
  { path: 'gerenciar-cores', component: GerenciarCoresComponent },
  { path: 'gerenciar-esportes', component: GerenciarEsportesComponent },
  { path: 'gerenciar-tenis', component: GerenciarTenisComponent }, 
  { path: '**', redirectTo: 'home' }
];