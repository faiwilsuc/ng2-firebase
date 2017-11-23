import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { LoginModule } from './login/modules/login.module';
import { SharedModule } from './shared/modules/shared/shared.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { WarehouseComponent } from './warehouse/components/warehouse.component';
import { AgentComponent } from './agent/components/agent.component';
import { ClientComponent } from './client/components/client.component';

import { AuthService } from './shared/services/auth.service';
import { WarehouseService } from './shared/services/warehouse.service';
import { AgentService } from './shared/services/agent.service';
import { ClientService } from './shared/services/client.service';
import { MessageService } from './shared/services/message.service';
import { ColorService } from './shared/services/color.service';

import { environment } from '../environments/environment';
import 'hammerjs';

@NgModule({
  declarations: [
    AppComponent,
    WarehouseComponent,
    AgentComponent,
    ClientComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase, 'defaultInstance'),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    LoginModule,
    SharedModule,
    AppRoutingModule
  ],
  providers: [AuthService, WarehouseService, AgentService, ClientService, MessageService, ColorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
