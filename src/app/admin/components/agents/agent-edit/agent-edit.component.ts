import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { MaterializeAction } from 'angular2-materialize';

import { AgentService } from '../../../../shared/services/agent.service';
import { WarehouseService } from '../../../../shared/services/warehouse.service';
import { Warehouse } from '../../../../shared/models/warehouse.model';

@Component({
  selector: 'app-agent-edit',
  templateUrl: './agent-edit.component.html',
  styleUrls: ['./agent-edit.component.css']
})
export class AgentEditComponent implements OnInit {

  agentForm: FormGroup;
  availableWarehouses: Warehouse[] = [];

  uid: string;
  lastWarehouseUid: string;
  editMode = false;

  loginModalActions = new EventEmitter<string | MaterializeAction>();
  loginInformation = '';

  constructor(private router: Router, private route: ActivatedRoute,
              private agentService: AgentService, private warehouseService: WarehouseService) { }

  ngOnInit() {
    this.availableWarehouses = this.warehouseService.warehouses;

    if (!this.availableWarehouses.length) {
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
    const agent = this.agentForm.value;

    if (this.editMode) {
      agent.uid = this.uid;
      agent.lastWarehouseUid = this.lastWarehouseUid;
    }

    this.agentService.storeAgent(agent, this.editMode)
      .then(
        (storeInfo: string) => {
          if (!this.editMode) {
            this.loginInformation = storeInfo;
            this.agentForm.reset();
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
    let agentName = '';
    let agentEmail = '';
    let agentPhoneNumber = '';
    let agentWarehouseUid = '';

    if (this.editMode) {
      const agent = this.agentService.getAgent(this.uid);
      if (agent) {
        agentName = agent.name;
        agentEmail = agent.email;
        agentPhoneNumber = agent.phoneNumber;
        agentWarehouseUid = agent.warehouseUid;
        this.lastWarehouseUid = agent.warehouseUid;
      } else {
        this.router.navigate(['../../'], {relativeTo: this.route});
      }
    }

    this.agentForm = new FormGroup({
      'name': new FormControl(agentName, Validators.required),
      'email': new FormControl(agentEmail, [Validators.required, Validators.email]),
      'phoneNumber': new FormControl(agentPhoneNumber, [Validators.required, Validators.pattern('[0]+[7]+\\d{8}')]),
      'warehouseUid': new FormControl(agentWarehouseUid, [Validators.required])
    });
  }
}
