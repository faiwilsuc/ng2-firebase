import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { WarehouseService } from '../../../../shared/services/warehouse.service';
import { Warehouse } from '../../../../shared/models/warehouse.model';

@Component({
  selector: 'app-warehouse-list',
  templateUrl: './warehouse-list.component.html',
  styleUrls: ['./warehouse-list.component.css']
})

export class WarehouseListComponent implements OnInit, OnDestroy {

  warehouses: Warehouse[] = [];
  warehousesSubscription: Subscription;

  filterString = '';
  filterProps = ['name', 'email', 'phoneNumber', 'location'];

  constructor(private warehouseService: WarehouseService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.warehousesSubscription = this.warehouseService.warehousesSubject.subscribe(
      warehouses => {
        this.warehouses = warehouses;
      }
    );
    this.warehouses = this.warehouseService.warehouses.slice();
  }

  onAddWarehouse(): void {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  onBackPressed(): void {
    this.router.navigate(['../../'], {relativeTo: this.route});
  }

  ngOnDestroy(): void {
    this.warehousesSubscription.unsubscribe();
  }
}
