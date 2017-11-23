import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from '../../../../../shared/services/message.service';
import { ColorService } from '../../../../../shared/services/color.service';
import { Agent } from '../../../../../shared/models/agent.model';
import { Contact } from '../../../../../shared/models/contact.model';

@Component({
  selector: 'app-agent-item',
  templateUrl: './agent-item.component.html',
  styleUrls: ['./agent-item.component.css']
})
export class AgentItemComponent implements OnInit {

  @Input() agent: Agent;

  public backgroundColor: string;
  public textColor: string;

  constructor(private router: Router, private route: ActivatedRoute,
              private colorService: ColorService, private messageService: MessageService) { }

  ngOnInit() {
    const colorDetails = this.colorService.getRandomColor();
    this.backgroundColor = colorDetails.backgroundColor;
    this.textColor = colorDetails.textColor;
  }

  onAgentDetails() {
    this.router.navigate(['details', this.agent.uid], {relativeTo: this.route});
  }

  onEditAgent() {
    this.router.navigate(['edit', this.agent.uid], {relativeTo: this.route});
  }

  onMessageAgent() {
    const contact = new Contact(this.agent.name, this.agent.email, this.agent.uid);
    this.messageService.openMessageModal(contact);
  }
}
