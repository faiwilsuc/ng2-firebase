import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AngularFireDatabase } from 'angularfire2/database';

import { AuthService } from './auth.service';
import { AgentService } from './agent.service';
import { Client } from '../models/client.model';

@Injectable()
export class ClientService {

  private PATH_TO_AGENTS = '/clients/';
  private PATH_TO_ADMIN_AGENT_REFS = '/admins/' + this.authService.getUserUid() + '/clients';

  private clientsRef = this.fireDatabase.database.ref(this.PATH_TO_AGENTS);
  private adminOwnedClientsRef = this.fireDatabase.database.ref(this.PATH_TO_ADMIN_AGENT_REFS);

  clientsSubject: BehaviorSubject<Client[]> = new BehaviorSubject<Client[]>([]);

  get clients(): Client[] {
    return this.clientsSubject.value;
  }

  constructor(private fireDatabase: AngularFireDatabase, private authService: AuthService, private agentService: AgentService) {

    // Whenever a new client reference is added this listener will push it in this.clients
    this.adminOwnedClientsRef.on('child_added',
      (snapshot) => {
        console.log('Loading details for client: ' + snapshot.key);

        // This listener will fetch the actual object and close itself after
        this.clientsRef.child(snapshot.key).on('value',
          (snap) => {
            let client = snap.val();
            console.log(client);
            client.uid = snap.key;

            client.agentName = this.agentService.agents.find(obj => obj.uid === client.agentUid).name;

            const oldClientIndex = this.clients.indexOf(this.clients.find(obj => obj.uid === client.uid));

            const updatedClients = this.clients.slice();

            if (oldClientIndex === -1) {
              updatedClients.push(client);
            } else {
              updatedClients.splice(oldClientIndex, 1, client);
            }

            this.clientsSubject.next(updatedClients);
          }
        );
      }
    );

    this.adminOwnedClientsRef.on('child_removed',
      (snapshot) => {
        const deletedAgentUid = snapshot.key;

        const updatedClients = this.clients.filter(obj => obj.uid !== deletedAgentUid);
        this.clientsSubject.next(updatedClients);
      });
  }

  public getClient(uid: string): Client {
    return this.clients.find(client => client.uid === uid);
  }

  public storeClient(client: Client, editMode: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!editMode) {
        this.authService.registerUser(client, 'client').then(
          ({result: result, loginInfo: loginInfo}) => {
            this.onCreateClient(client, result.uid);
            resolve(loginInfo);
          }
        );
      } else {
        this.onUpdateClient(client, client.uid, client.lastAgentUid);
        const updateInfo = 'Updated client with UID ' + client.uid;
        resolve(updateInfo);
      }
    });
  }

  private onCreateClient(client: Client, uid: string): void {
    this.clientsRef.child(uid).set(client);
    this.agentService.onAssignClient(client.agentUid, uid);
    // We store the uid by assigning it a value of true which will be ignored
    this.adminOwnedClientsRef.child(uid).set(true);
  }

  private onUpdateClient(client: Client, clientUid: string, lastAgentUid: string): void {
    console.log('Update called');

    client.uid = null;
    client.lastAgentUid = null;

    this.clientsRef.child(clientUid).update(client);
    this.agentService.onAssignClient(client.agentUid, clientUid, lastAgentUid);
  }
}
