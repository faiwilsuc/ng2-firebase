import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';
import { AdminRoutingModule } from './admin-routing.module';


import { AdminComponent } from '../components/admin.component';

import { MenuComponent } from '../components/menu/menu.component';

import { WarehousesComponent } from '../components/warehouses/warehouses.component';
import { WarehouseListComponent } from '../components/warehouses/warehouse-list/warehouse-list.component';
import { WarehouseItemComponent } from '../components/warehouses/warehouse-list/warehouse-item/warehouse-item.component';
import { WarehouseDetailsComponent } from '../components/warehouses/warehouse-details/warehouse-details.component';
import { WarehouseEditComponent } from '../components/warehouses/warehouse-edit/warehouse-edit.component';

import { AgentsComponent } from '../components/agents/agents.component';
import { AgentListComponent } from '../components/agents/agent-list/agent-list.component';
import { AgentItemComponent } from '../components/agents/agent-list/agent-item/agent-item.component';
import { AgentDetailsComponent } from '../components/agents/agent-details/agent-details.component';
import { AgentEditComponent } from '../components/agents/agent-edit/agent-edit.component';

import { ClientsComponent } from '../components/clients/clients.component';
import { ClientListComponent } from '../components/clients/client-list/client-list.component';
import { ClientItemComponent } from '../components/clients/client-list/client-item/client-item.component';
import { ClientDetailsComponent } from '../components/clients/client-details/client-details.component';
import { ClientEditComponent } from '../components/clients/client-edit/client-edit.component';

import { MessagesComponent } from '../components/messages/messages.component';

import { StatisticsComponent } from '../components/statistics/statistics.component';

import { OrdersComponent } from '../components/orders/orders.component';

import { FilterPipe } from '../../shared/pipes/filter.pipe';
import { SharedModule } from '../../shared/modules/shared/shared.module';

@NgModule({
  declarations: [
    AdminComponent,
    MenuComponent,
    WarehousesComponent,
    WarehouseListComponent,
    WarehouseItemComponent,
    WarehouseDetailsComponent,
    WarehouseEditComponent,
    AgentsComponent,
    AgentListComponent,
    AgentItemComponent,
    AgentDetailsComponent,
    AgentEditComponent,
    ClientsComponent,
    ClientListComponent,
    ClientItemComponent,
    ClientDetailsComponent,
    ClientEditComponent,
    MessagesComponent,
    StatisticsComponent,
    OrdersComponent,
    FilterPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterializeModule,
    SharedModule,
    AdminRoutingModule
  ],
  providers: []
})
export class AdminModule {}
