export class Client {

  public uid: string;
  public name: string;
  public email: string;
  public phoneNumber: string;
  public agentUid: string;
  public warehouseUid: string;
  public agentName: string;
  public lastAgentUid: string;

  constructor(name: string, email: string, phoneNumber: string, agentUid: string, warehouseUid) {
    this.name = name;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.agentUid = agentUid;
    this.warehouseUid = warehouseUid;
  }
}
