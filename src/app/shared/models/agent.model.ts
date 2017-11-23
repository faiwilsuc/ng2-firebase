export class Agent {

  public uid: string;
  public name: string;
  public email: string;
  public phoneNumber: string;
  public warehouseUid: string;
  public clientsUid: string[];
  public warehouseName: string;
  public lastWarehouseUid: string;

  constructor(name: string, email: string, phoneNumber: string, warehouseUid: string, clientsUid: string[]) {
    this.name = name;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.warehouseUid = warehouseUid;
    this.clientsUid = clientsUid;
  }
}
