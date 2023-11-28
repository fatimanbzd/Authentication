import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent {
  isSuccess = true;
  title: string = '';
  message: string = '';
  
  constructor (protected bsModalRef:BsModalRef){}
}
