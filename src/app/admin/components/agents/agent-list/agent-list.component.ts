import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { AgentService } from '../../../../shared/services/agent.service';
import { Agent } from '../../../../shared/models/agent.model';


@Component({
  selector: 'app-agent-list',
  templateUrl: './agent-list.component.html',
  styleUrls: ['./agent-list.component.css']
})
export class AgentListComponent implements OnInit, OnDestroy {

  agents: Agent[] = [];
  agentsSubscription: Subscription;

  filterString = '';
  filterProps = ['name', 'email', 'phoneNumber', 'warehouseName'];

  constructor(private router: Router, private route: ActivatedRoute, public agentService: AgentService) {
  }

  ngOnInit() {
    this.agentsSubscription = this.agentService.agentsSubject.subscribe(
      (agents) => this.agents = agents
    );
    this.agents = this.agentService.agents.slice();
  }

  onAddAgent(): void {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  onBackPressed(): void {
    this.router.navigate(['../../'], {relativeTo: this.route});
  }

  ngOnDestroy() {
  }

}
