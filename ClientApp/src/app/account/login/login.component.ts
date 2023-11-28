import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AccountService } from '../account.service';
import { ILoginModel } from 'src/app/shared/models/login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit , OnDestroy{

  loginForm!: FormGroup;
  submitted = false;
  errorMessages: string[] = [];

  constructor(private fb: FormBuilder,
    private accountService: AccountService,
  private router: Router) { }
  
  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
    
      username: [
        '',
        [
          Validators.required,
          Validators.pattern('^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$'),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
        ],
      ],
    });
  }

  login() {
      this.submitted = true;
    this.errorMessages = [];
    if (this.loginForm.invalid) return;

    this.accountService
      .login(this.loginForm.value as ILoginModel)
      .subscribe({
        next: (response: any) => {

          this.router.navigateByUrl('/play');
        },
        error: (error) => {
          if (error.error.error) this.errorMessages = error?.error?.error;
          else this.errorMessages.push(error.error);
        },
      });
  }

  ngOnDestroy(): void {
      
  }

}
