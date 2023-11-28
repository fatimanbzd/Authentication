import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRegisterModel } from '../shared/models/register';
import { environment } from 'src/environments/environment.development';
import { ILoginModel } from '../shared/models/login';
import { IUserModel } from '../shared/models/user';
import { ReplaySubject, map, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private _userSource = new ReplaySubject<IUserModel | null>(1);
  user$ = this._userSource.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  refresh(jwt: string | null) {

    if (jwt === null) {
      this._userSource.next(null);
      return of(undefined);
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);

    return this.http
      .get<IUserModel>(`${environment.appurl}/api/account/refresh-user-token`, {
        headers,
      })
      .pipe(
        map((user) => {
          if (user) this.setUser(user);
        })
      );
  }

  login(model: ILoginModel) {
    return this.http
      .post<IUserModel>(`${environment.appurl}/api/account/login`, model)
      .pipe(
        map((user: IUserModel) => {
          if (user) this.setUser(user);
        })
      );
  }

  logout() {
    localStorage.removeItem(environment.userKey);
    this._userSource.next(null);
    this.router.navigateByUrl('/');
  }

  register(model: IRegisterModel) {
    return this.http.post(`${environment.appurl}/api/account/register`, model);
  }

  setUser(user: IUserModel) {
    localStorage.setItem(environment.userKey, JSON.stringify(user));
    this._userSource.next(user);
  }

  getJwt() {
    const key = localStorage.getItem(environment.userKey);
    if (!key) return null;
    return JSON.parse(key).jwt;
  }
}
