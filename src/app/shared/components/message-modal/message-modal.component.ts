import { Component, EventEmitter, OnInit } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from '../../services/message.service';

import { Contact } from '../../models/contact.model';
import { Message } from '../../models/message.model';

@Component({
  selector: 'app-message-modal',
  templateUrl: './message-modal.component.html',
  styleUrls: ['./message-modal.component.css']
})
export class MessageModalComponent implements OnInit {

  public messageForm: FormGroup;

  messageReceiver: Contact = new Contact('', '', '');
  messageModalActions = new EventEmitter<string | MaterializeAction>();

  constructor(private messageService: MessageService) { }

  ngOnInit() {
    this.messageModalActions = this.messageService.messageModalActions;
    this.messageService.messageReceiverEvent.subscribe(
      (receiver: Contact) => {
        this.messageReceiver = receiver;
      }
    );

    this.onFormInit();
  }

  onFormInit(): void {
    let messageSubject = '';
    let messageBody = '';

    this.messageForm = new FormGroup({
      'subject': new FormControl(messageSubject, Validators.required),
      'body': new FormControl(messageBody, Validators.required)
    });
  }

  onSendMessage(): void {
    if (this.messageForm.valid) {
      let message: Message = this.messageForm.value;

      message.receivers = [];
      message.receivers.push(this.messageReceiver);

      this.messageService.sendMessage(message.subject, message.body, message.receivers);

      this.messageForm.reset();
      this.messageService.closeMessageModal();
    }
  }

}
