import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { AdminComponent } from '../components/admin.component';

import { MenuComponent } from '../components/menu/menu.component';

import { WarehousesComponent } from '../components/warehouses/warehouses.component';
import { WarehouseListComponent } from '../components/warehouses/warehouse-list/warehouse-list.component';
import { WarehouseDetailsComponent } from '../components/warehouses/warehouse-details/warehouse-details.component';
import { WarehouseEditComponent } from '../components/warehouses/warehouse-edit/warehouse-edit.component';

import { AgentsComponent } from '../components/agents/agents.component';
import { AgentListComponent } from '../components/agents/agent-list/agent-list.component';
import { AgentDetailsComponent } from '../components/agents/agent-details/agent-details.component';
import { AgentEditComponent } from '../components/agents/agent-edit/agent-edit.component';

import { ClientsComponent } from '../components/clients/clients.component';
import { ClientListComponent } from '../components/clients/client-list/client-list.component';
import { ClientDetailsComponent } from '../components/clients/client-details/client-details.component';
import { ClientEditComponent } from '../components/clients/client-edit/client-edit.component';

import { MessagesComponent } from '../components/messages/messages.component';

import { StatisticsComponent } from '../components/statistics/statistics.component';

import { OrdersComponent } from '../components/orders/orders.component';

const adminRoutes: Routes = [
  { path: '', component: AdminComponent, children: [
    { path: '', component: MenuComponent },
    { path: 'warehouses', component: WarehousesComponent, children: [
      { path: '', component: WarehouseListComponent },
      { path: 'details/:uid', component: WarehouseDetailsComponent },
      { path: 'edit/:uid', component: WarehouseEditComponent },
      { path: 'new', component: WarehouseEditComponent }
    ]},
    { path: 'agents', component: AgentsComponent, children: [
      { path: '', component: AgentListComponent },
      { path: 'details/:uid', component: AgentDetailsComponent },
      { path: 'edit/:uid', component: AgentEditComponent },
      { path: 'new', component: AgentEditComponent }
    ]},
    { path: 'clients', component: ClientsComponent, children: [
      { path: '', component: ClientListComponent },
      { path: 'details/:uid', component: ClientDetailsComponent },
      { path: 'edit/:uid', component: ClientEditComponent },
      { path: 'new', component: ClientEditComponent }
    ]},
    { path: 'messages', component: MessagesComponent},
    { path: 'statistics', component: StatisticsComponent},
    { path: 'orders', component: OrdersComponent}
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule],
  declarations: []
})
export class AdminRoutingModule { }
