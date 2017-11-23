import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from '../../../../../shared/services/message.service';
import { ColorService } from '../../../../../shared/services/color.service';
import { Warehouse } from '../../../../../shared/models/warehouse.model';
import { Contact } from '../../../../../shared/models/contact.model';

@Component({
  selector: 'app-warehouse-item',
  templateUrl: './warehouse-item.component.html',
  styleUrls: ['./warehouse-item.component.css']
})
export class WarehouseItemComponent implements OnInit {

  @Input() warehouse: Warehouse;

  public backgroundColor: string;
  public textColor: string;

  @Input() messageModalActions;

  constructor(private router: Router, private route: ActivatedRoute,
              private messageService: MessageService, private colorService: ColorService) { }

  ngOnInit() {
    const colorDetails = this.colorService.getRandomColor();
    this.backgroundColor = colorDetails.backgroundColor;
    this.textColor = colorDetails.textColor;
  }

  onWarehouseDetails() {
    this.router.navigate(['details', this.warehouse.uid], {relativeTo: this.route});
  }

  onEditWarehouse() {
    this.router.navigate(['edit', this.warehouse.uid], {relativeTo: this.route});
  }

  onMessageWarehouse() {
    const contact = new Contact(this.warehouse.name, this.warehouse.email, this.warehouse.uid);
    this.messageService.openMessageModal(contact);
  }

}
