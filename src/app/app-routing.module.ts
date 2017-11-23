import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/components/login.component';
import { WarehouseComponent } from './warehouse/components/warehouse.component';
import { AgentComponent } from './agent/components/agent.component';
import { ClientComponent } from './client/components/client.component';

import { AuthGuard } from './shared/services/auth-guard.service';

const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'admin', loadChildren: './admin/modules/admin.module#AdminModule', canActivate: [AuthGuard] },
  { path: 'warehouse', component: WarehouseComponent, canActivate: [AuthGuard]},
  { path: 'agent', component: AgentComponent, canActivate: [AuthGuard]},
  { path: 'client', component: ClientComponent, canActivate: [AuthGuard]},

  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
