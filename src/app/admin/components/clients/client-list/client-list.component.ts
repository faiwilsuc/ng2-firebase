import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { ClientService } from '../../../../shared/services/client.service';
import { Client } from '../../../../shared/models/client.model';


@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit, OnDestroy {

  clients: Client[] = [];
  clientsSubscription: Subscription;

  filterString = '';
  filterProps = ['name', 'email', 'phoneNumber', 'agentName'];

  constructor(private router: Router, private route: ActivatedRoute, public clientService: ClientService) {
  }

  ngOnInit() {
    this.clientsSubscription = this.clientService.clientsSubject.subscribe(
      (clients) => this.clients = clients
    );
    this.clients = this.clientService.clients.slice();
  }

  onAddClient(): void {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  onBackPressed(): void {
    this.router.navigate(['../../'], {relativeTo: this.route});
  }

  ngOnDestroy() {
  }

}
