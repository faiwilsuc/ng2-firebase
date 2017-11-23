import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { MaterializeAction } from 'angular2-materialize';

import { WarehouseService } from '../../../../shared/services/warehouse.service';

@Component({
  selector: 'app-warehouse-edit',
  templateUrl: './warehouse-edit.component.html',
  styleUrls: ['./warehouse-edit.component.css']
})
export class WarehouseEditComponent implements OnInit {

  warehouseForm: FormGroup;

  uid: string;
  editMode = false;

  loginModalActions = new EventEmitter<string | MaterializeAction>();
  loginInformation = '';

  constructor(private router: Router, private route: ActivatedRoute, private warehouseService: WarehouseService) {
  }

  ngOnInit() {
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
    const warehouse = this.warehouseForm.value;

    if (this.editMode) {
      warehouse.uid = this.uid;
    }

    this.warehouseService.storeWarehouse(warehouse, this.editMode)
      .then(
        (storeInfo: string) => {
          if (!this.editMode) {
            this.loginInformation = storeInfo;
            this.warehouseForm.reset();
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
    let warehouseName = '';
    let warehouseEmail = '';
    let warehouseLocation = '';
    let warehousePhoneNumber = '';

    if (this.editMode) {
      const warehouse = this.warehouseService.getWarehouse(this.uid);
      if (warehouse) {
        warehouseName = warehouse.name;
        warehouseEmail = warehouse.email;
        warehouseLocation = warehouse.location;
        warehousePhoneNumber = warehouse.phoneNumber;
      } else {
        this.router.navigate(['../../'], {relativeTo: this.route});
      }
    }

    this.warehouseForm = new FormGroup({
      'name': new FormControl(warehouseName, Validators.required),
      'email': new FormControl(warehouseEmail, [Validators.required, Validators.email]),
      'location': new FormControl(warehouseLocation, Validators.required),
      'phoneNumber': new FormControl(warehousePhoneNumber, [Validators.required, Validators.pattern('[0]+[7]+\\d{8}')])
    });
  }
}
