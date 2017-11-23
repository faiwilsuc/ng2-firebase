import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AngularFireDatabase } from 'angularfire2/database';

import { AuthService } from './auth.service';
import { Warehouse } from '../models/warehouse.model';

@Injectable()
export class WarehouseService {

  private PATH_TO_WAREHOUSES = '/warehouses/';
  private PATH_TO_ADMIN_REFS = '/admins/' + this.authService.getUserUid() + '/warehouses';

  private warehousesRef = this.fireDatabase.database.ref(this.PATH_TO_WAREHOUSES);
  private adminOwnedWarehousesRef = this.fireDatabase.database.ref(this.PATH_TO_ADMIN_REFS);

  public warehousesSubject: BehaviorSubject<Warehouse[]> = new BehaviorSubject<Warehouse[]>([]);
  get warehouses(): Warehouse[] {
    return this.warehousesSubject.value;
  }

  constructor(private fireDatabase: AngularFireDatabase, private authService: AuthService) {

    // Every time a child is added/ updated on PATH_TO_ADMIN_REFS we fetch
    // the child from PATH_TO_WAREHOUSES and store it locally
    this.adminOwnedWarehousesRef.on('child_added',
      (snapshot) => {
        console.log('Loading details for warehouse: ' + snapshot.key);

        // adminRef listener iterates through every existing child at
        // start and opens a listener for each warehouseObject
        this.warehousesRef.child(snapshot.key).on('value',
          (snap) => {
            let warehouse = snap.val();
            console.log(warehouse);
            warehouse.uid = snap.key;

            const oldWarehouseIndex = this.warehouses.indexOf(this.warehouses.find(obj => obj.uid === warehouse.uid));

            const updatedWarehouses = this.warehouses.slice();

            if (oldWarehouseIndex === -1) {
              updatedWarehouses.push(warehouse);
            } else {
              updatedWarehouses.splice(oldWarehouseIndex, 1, warehouse);
            }

            this.warehousesSubject.next(updatedWarehouses);
          }
        );
      }
    );

    this.adminOwnedWarehousesRef.on('child_removed',
      (snapshot) => {
        console.log('Removed listener');
        const deletedWarehouseUid = snapshot.key;

        const updatedAgents = this.warehouses.filter(obj => obj.uid !== deletedWarehouseUid);
        this.warehousesSubject.next(updatedAgents);
      });
  }

  public getWarehouse(uid: string): Warehouse {
    return this.warehouses.find(warehouse => warehouse.uid === uid);
  }

  public storeWarehouse(warehouse: Warehouse, editMode: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!editMode) {
        this.authService.registerUser(warehouse, 'warehouse').then(
          ({result: result, loginInfo: loginInfo}) => {
            this.onCreateWarehouse(warehouse, result.uid);
            resolve(loginInfo);
          }
        );
      } else {
        this.onUpdateWarehouse(warehouse, warehouse.uid);
        const updateInfo = 'Updated warehouse with UID ' + warehouse.uid;
        resolve(updateInfo);
      }
    });
  }

  private onCreateWarehouse(warehouse: Warehouse, uid: string): void {
    this.warehousesRef.child(uid).set(warehouse);
    // We store the uid by assigning it a value of true which will be ignored
    this.adminOwnedWarehousesRef.child(uid).set(true);
  }

  private onUpdateWarehouse(warehouse: Warehouse, uid: string): void {
    console.log('Update called');

    warehouse.uid = null;

    this.warehousesRef.child(uid).update(warehouse);
  }

  public onAssignAgent(warehouseUid: string, agentUid: string, lastWarehouseUid?: string) {
    if (lastWarehouseUid) {
      this.warehousesRef.child(lastWarehouseUid).child('agentsUid').child(agentUid).remove();
    }

    this.warehousesRef.child(warehouseUid).child('agentsUid').child(agentUid).set(true);
  }
}
