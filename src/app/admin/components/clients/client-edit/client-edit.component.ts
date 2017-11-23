import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { MaterializeAction } from 'angular2-materialize';

import { ClientService } from '../../../../shared/services/client.service';
import { AgentService } from '../../../../shared/services/agent.service';
import { Agent } from '../../../../shared/models/agent.model';

@Component({
  selector: 'app-client-edit',
  templateUrl: './client-edit.component.html',
  styleUrls: ['./client-edit.component.css']
})
export class ClientEditComponent implements OnInit {

  clientForm: FormGroup;
  availableAgents: Agent[] = [];

  uid: string;
  lastAgentUid: string;
  editMode = false;

  loginModalActions = new EventEmitter<string | MaterializeAction>();
  loginInformation = '';

  constructor(private router: Router, private route: ActivatedRoute,
              private clientService: ClientService, private agentService: AgentService) { }

  ngOnInit() {
    this.availableAgents = this.agentService.agents;
    if (!this.availableAgents.length) {
      this.router.navigate(['../'], {relativeTo: this.route});
    }

    this.route.params.subscribe(
      (params: Params) => {
        this.uid = params['uid'];
        this.editMode = !!params['uid'];
        this.onFormInit();
      }
    );
  }

  openModal() {
    this.loginModalActions.emit({action: 'modal', params: ['open']});
  }

  closeModal() {
    this.loginModalActions.emit({action: 'modal', params: ['close']});
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onSubmit() {
    const client = this.clientForm.value;

    if (this.editMode) {
      client.uid = this.uid;
      client.lastAgentUid = this.lastAgentUid;
    }

    this.clientService.storeClient(client, this.editMode)
      .then(
        (storeInfo: string) => {
          if (!this.editMode) {
            this.loginInformation = storeInfo;
            this.clientForm.reset();
            this.openModal();
          } else {
            this.router.navigate(['../../'], {relativeTo: this.route});
          }
        }
      )
      .catch(
        (error) => {
          // TODO: Handle error messages

          console.log(error);
        }
      );
  }

  onBackPressed() {
    if (this.editMode) {
      this.router.navigate(['../../'], {relativeTo: this.route});
    } else {
      this.router.navigate(['../'], {relativeTo: this.route});
    }
  }

  onFormInit() {
    let clientName = '';
    let clientEmail = '';
    let clientPhoneNumber = '';
    let clientAgentUid = '';

    if (this.editMode) {
      const client = this.clientService.getClient(this.uid);
      if (client) {
        clientName = client.name;
        clientEmail = client.email;
        clientPhoneNumber = client.phoneNumber;
        clientAgentUid = client.agentUid;
        this.lastAgentUid = client.agentUid;
      } else {
        this.router.navigate(['../../'], {relativeTo: this.route});
      }
    }

    this.clientForm = new FormGroup({
      'name': new FormControl(clientName, Validators.required),
      'email': new FormControl(clientEmail, [Validators.required, Validators.email]),
      'phoneNumber': new FormControl(clientPhoneNumber, [Validators.required, Validators.pattern('[0]+[7]+\\d{8}')]),
      'agentUid': new FormControl(clientAgentUid, [Validators.required])
    });
  }
}
