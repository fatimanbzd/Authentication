import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRegisterModel } from '../shared/models/register';
import { environment } from 'src/environments/environment.development';
import { ILoginModel } from '../shared/models/login';
import { IUserModel } from '../shared/models/user';
import { ReplaySubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {

  private _userSource = new ReplaySubject<IUserModel | null>(1);
  user$ = this._userSource.asObservable();
  constructor(private http: HttpClient) {}

  login(model: ILoginModel) {
    return this.http.post<IUserModel>(`${environment.appurl}/api/account/login`, model)
      .pipe(map((user: IUserModel) => {
        if (user)
          this.setUser(user);
      }));
  }

  register(model: IRegisterModel) {
    return this.http.post(`${environment.appurl}/api/account/register`, model);
  }

  setUser(user: IUserModel) {
    localStorage.setItem(environment.userKey, JSON.stringify(user));
    this._userSource.next(user);


    // this.user$.subscribe(user => console.log(user));

  }
}
