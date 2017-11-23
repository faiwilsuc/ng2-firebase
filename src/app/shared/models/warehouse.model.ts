export class Warehouse {

  public uid: string;
  public name: string;
  public email: string;
  public location: string;
  public phoneNumber: string;
  public agentsUid: string[];

  constructor(name: string, email: string, location: string, phoneNumber: string, agentsUid: string[]) {
    this.name = name;
    this.email = email;
    this.location = location;
    this.phoneNumber = phoneNumber;
    this.agentsUid = agentsUid;
  }
}
