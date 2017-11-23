import { Contact } from './contact.model';

export class Message {

  public subject: string;
  public body: string;
  public sender: Contact;
  public receivers: Contact[];
  public timeAndDate: string;

  constructor(subject: string, body: string, sender: Contact, receivers: Contact[], timeAndDate: string) {
    this.subject = subject;
    this.body = body;
    this.sender = sender;
    this.receivers = receivers;
    this.timeAndDate = timeAndDate;
  }
}
