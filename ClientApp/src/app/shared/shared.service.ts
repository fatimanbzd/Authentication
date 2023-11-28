import { Injectable } from '@angular/core';
import { BsModalService, ModalOptions, BsModalRef } from 'ngx-bootstrap/modal';
import { NotificationComponent } from './components/modals/notification/notification.component';

@Injectable({
  providedIn: 'root',
})
export class SharedService {

  bsModalRef!: BsModalRef;

  constructor(private modalService: BsModalService) {}

  showNotification(isSuccess: boolean, title: string, message: string) {
    const initialState: ModalOptions = {
      initialState: {
        isSuccess: isSuccess,
        title: title,
        message: message,
      },
    };

     this.bsModalRef = this.modalService.show(NotificationComponent, initialState);
  }
}
