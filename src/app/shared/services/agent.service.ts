import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AngularFireDatabase } from 'angularfire2/database';

import { AuthService } from './auth.service';
import { WarehouseService } from './warehouse.service';
import { Agent } from '../models/agent.model';

@Injectable()
export class AgentService {

  private PATH_TO_AGENTS = '/agents/';
  private PATH_TO_ADMIN_AGENT_REFS = '/admins/' + this.authService.getUserUid() + '/agents';

  private agentsRef = this.fireDatabase.database.ref(this.PATH_TO_AGENTS);
  private adminOwnedAgentsRef = this.fireDatabase.database.ref(this.PATH_TO_ADMIN_AGENT_REFS);

  agentsSubject: BehaviorSubject<Agent[]> = new BehaviorSubject<Agent[]>([]);
  get agents(): Agent[] {
    return this.agentsSubject.value;
  }

  constructor(private fireDatabase: AngularFireDatabase, private authService: AuthService, private warehouseService: WarehouseService) {

    // Whenever a new agent reference is added this listener will push it in this.agents
    this.adminOwnedAgentsRef.on('child_added',
      (snapshot) => {
        console.log('Loading details for agent: ' + snapshot.key);

        // This listener will fetch the actual object and close itself after
        this.agentsRef.child(snapshot.key).on('value',
          (snap) => {
            let agent = snap.val();
            console.log(agent);
            agent.uid = snap.key;

            agent.warehouseName = this.warehouseService.warehouses.find(obj => obj.uid === agent.warehouseUid).name;

            const oldAgentIndex = this.agents.indexOf(this.agents.find(obj => obj.uid === agent.uid));

            const updatedAgents = this.agents.slice();

            if (oldAgentIndex === -1) {
              updatedAgents.push(agent);
            } else {
              updatedAgents.splice(oldAgentIndex, 1, agent);
            }

            this.agentsSubject.next(updatedAgents);
          }
        );
      }
    );

    this.adminOwnedAgentsRef.on('child_removed',
      (snapshot) => {
        const deletedWarehouseUid = snapshot.key;

        const updatedAgents = this.agents.filter( obj => obj.uid !== deletedWarehouseUid);
        this.agentsSubject.next(updatedAgents);
      });
  }

  public getAgent(uid: string): Agent {
    return this.agents.find(agent => agent.uid === uid);
  }

  public storeAgent(agent: Agent, editMode: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!editMode) {
        this.authService.registerUser(agent, 'agent').then(
          ({result: result, loginInfo: loginInfo}) => {
            this.onCreateAgent(agent, result.uid);
            resolve(loginInfo);
          }
        );
      } else {
        this.onUpdateAgent(agent, agent.uid, agent.lastWarehouseUid);
        const updateInfo = 'Updated agent with UID ' + agent.uid;
        resolve(updateInfo);
      }
    });
  }

  private onCreateAgent(agent: Agent, uid: string): void {
    this.agentsRef.child(uid).set(agent);
    this.warehouseService.onAssignAgent(agent.warehouseUid, uid);
    // We store the uid by assigning it a value of true which will be ignored
    this.adminOwnedAgentsRef.child(uid).set(true);
  }

  private onUpdateAgent(agent: Agent, agentUid: string, lastWarehouseUid: string): void {
    console.log('Update called');

    agent.uid = null;
    agent.lastWarehouseUid = null;

    this.agentsRef.child(agentUid).update(agent);
    this.warehouseService.onAssignAgent(agent.warehouseUid, agentUid, lastWarehouseUid);
  }

  public onAssignClient(agentUid: string, clientUid: string, lastAgentUid?: string) {
    if (lastAgentUid) {
      this.agentsRef.child(lastAgentUid).child('clientsUid').child(clientUid).remove();
    }

    this.agentsRef.child(agentUid).child('clientsUid').child(clientUid).set(true);
  }
}
