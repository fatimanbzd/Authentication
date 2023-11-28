import { Component, OnInit } from '@angular/core';
import { AccountService } from './account/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private accountService: AccountService) { }
  ngOnInit(): void {
    this.refreshUser();
  }

  refreshUser(): void {
    const jwt = this.accountService.getJwt();
    if (jwt) {
      this.accountService.refresh(jwt).subscribe({
        next: (_) => { },
        error: (_) => {
          this.accountService.logout();
        },
      });
    }
    else {
      this.accountService.refresh(null).subscribe(  );

    }
  }
}
