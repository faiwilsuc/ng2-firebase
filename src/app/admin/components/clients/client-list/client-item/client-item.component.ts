import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from '../../../../../shared/services/message.service';
import { ColorService } from '../../../../../shared/services/color.service';
import { Client } from '../../../../../shared/models/client.model';
import { Contact } from '../../../../../shared/models/contact.model';

@Component({
  selector: 'app-client-item',
  templateUrl: './client-item.component.html',
  styleUrls: ['./client-item.component.css']
})
export class ClientItemComponent implements OnInit {

  @Input() client: Client;

  public backgroundColor: string;
  public textColor: string;

  constructor(private router: Router, private route: ActivatedRoute,
              private messageService: MessageService, private colorService: ColorService) { }

  ngOnInit() {
    const colorDetails = this.colorService.getRandomColor();
    this.backgroundColor = colorDetails.backgroundColor;
    this.textColor = colorDetails.textColor;
  }

  onClientDetails() {
    this.router.navigate(['details', this.client.uid], {relativeTo: this.route});
  }

  onEditClient() {
    this.router.navigate(['edit', this.client.uid], {relativeTo: this.route});
  }

  onMessageClient() {
    const contact = new Contact(this.client.name, this.client.email, this.client.uid);
    this.messageService.openMessageModal(contact);
  }

}
