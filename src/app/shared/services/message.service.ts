import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { MaterializeAction } from 'angular2-materialize';
import { AngularFireDatabase } from 'angularfire2/database';

import { AuthService } from './auth.service';
import { Message } from '../models/message.model';
import { Contact } from '../models/contact.model';

import * as firebase from 'firebase/app';
import * as moment from 'moment';
import * as assert from 'assert';

import DataSnapshot = firebase.database.DataSnapshot;

import 'moment/locale/ro'; // Due to a bug in the library locale format must be imported in order to override default

@Injectable()
export class MessageService {

  public inboxMessagesSubject: BehaviorSubject<Message[]> = new BehaviorSubject([]);
  public outboxMessageSubject: BehaviorSubject<Message[]> = new BehaviorSubject([]);

  // Component will listen to this subject in order to display a notificaation about new messages
  // If we decide to use chrome notification it will be moved in fb's Functions
  public newMessagesHaveArrivedSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public agentsContactsSubject: BehaviorSubject<Contact[]> = new BehaviorSubject([]);
  public warehousesContactsSubject: BehaviorSubject<Contact[]> = new BehaviorSubject([]);
  public clientsContactsSubject: BehaviorSubject<Contact[]> = new BehaviorSubject([]);

  messageReceiverEvent = new EventEmitter<Contact>();
  messageModalActions = new EventEmitter<string | MaterializeAction>();

  private CURR_USER_UID = this.authService.getUserUid();

  private PATH_TO_USER_INBOX = '/messages/' + this.CURR_USER_UID + '/inbox';
  private PATH_TO_USER_OUTBOX = '/messages/' + this.CURR_USER_UID + '/outbox';

  private PATH_TO_AGENTS = '/agents/';
  private PATH_TO_WAREHOUSES = '/warehouses/';
  private PATH_TO_CLIENTS = '/clients/';

  private userInboxRef = this.fireDatabase.database.ref(this.PATH_TO_USER_INBOX);
  private userOutboxRef = this.fireDatabase.database.ref(this.PATH_TO_USER_OUTBOX);

  private agentsRef = this.fireDatabase.database.ref(this.PATH_TO_AGENTS);
  private warehousesRef = this.fireDatabase.database.ref(this.PATH_TO_WAREHOUSES);
  private clientsRef = this.fireDatabase.database.ref(this.PATH_TO_CLIENTS);

  get inbox(): Message[] {
    return this.inboxMessagesSubject.getValue();
  }

  get outbox(): Message[] {
    return this.outboxMessageSubject.getValue();
  }

  constructor(private fireDatabase: AngularFireDatabase, private authService: AuthService) {
    const currUserUid = this.authService.getUserUid();

    this.userInboxRef.on('value',
      (messageSnapshot: DataSnapshot) => {
        const message: Message = messageSnapshot.val();
        let messages = this.inboxMessagesSubject.getValue();

        messages.push(message);

        this.inboxMessagesSubject.next(messages);
      }
    );

    this.userOutboxRef.on('value',
      (messageSnapshot: DataSnapshot) => {
        const message: Message = messageSnapshot.val();
        let messages = this.outboxMessageSubject.getValue();

        messages.push(message);

        this.outboxMessageSubject.next(messages);
      }
    );

    this.userInboxRef.on('child_added',
      () => this.newMessagesHaveArrivedSubject.next(true)
    );

    this.agentsRef.on('value',
      agentSnapshot => {
        const agentContact: Contact = new Contact(agentSnapshot.child('name').val(), agentSnapshot.child('email').val(), agentSnapshot.key);

        let agents = this.agentsContactsSubject.getValue();
        agents.push(agentContact);

        this.agentsContactsSubject.next(agents);
      }
    );

    this.clientsRef.on('value',
      clientSnapshot => {
        const clientContact: Contact = new Contact(clientSnapshot.child('name').val(),
          clientSnapshot.child('email').val(), clientSnapshot.key);

        let clients = this.clientsContactsSubject.getValue();
        clients.push(clientContact);

        this.clientsContactsSubject.next(clients);
      }
    );

    this.warehousesRef.on('value',
      warehouseSnapshot => {
        const warehouseContact: Contact = new Contact(warehouseSnapshot.child('name').val(),
          warehouseSnapshot.child('email').val(), warehouseSnapshot.key);

        let warehouses = this.warehousesContactsSubject.getValue();
        warehouses.push(warehouseContact);

        this.warehousesContactsSubject.next(warehouses);
      }
    );
  }

  public sendMessage(messageSubject: string, messageBody: string, receiversArray: Contact[]): void {
    const timestamp = this.getCurrentDateFormatted();

    const sender = new Contact('USER_NAME', this.authService.getUserEmail(), this.authService.getUserUid());

    receiversArray.forEach(
      receiver => {
        let message = new Message(messageSubject, messageBody, sender, [receiver], timestamp);

        this.fireDatabase.database.ref('/messages/' + receiver.uid + '/inbox/').push(message);

        console.log('Message successfully sent to ' + receiver.name);
        console.log(message);
      }
    );

    this.userOutboxRef.push(new Message(messageBody, messageBody, sender, receiversArray, timestamp));
  }

  public openMessageModal(receiver: Contact) {
    this.messageReceiverEvent.emit(receiver);
    this.messageModalActions.emit({action: 'modal', params: ['open']});
  }

  public closeMessageModal() {
    this.messageModalActions.emit({action: 'modal', params: ['close']});
  }

  private getCurrentDateFormatted(): string {
    assert(moment.locale() === 'ro'); // Hit the panic button if it fam ils

    // Date will look like this in locale ro format: "Mar, 17 Apr 15:42"
    return moment().format('ddd, DD-MMM HH:mm');
  }
}
