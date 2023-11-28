import { Component } from '@angular/core';
import { AccountService } from '../account/account.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  constructor(protected accountService: AccountService) {}

  logout() {
    this.accountService.logout();
  }
}
