import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRegisterModel } from '../shared/models/register';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private http: HttpClient) {}

  register(model: IRegisterModel) {
    return this.http.post(`${environment.appurl}/api/account/register`, model);
  }
}
