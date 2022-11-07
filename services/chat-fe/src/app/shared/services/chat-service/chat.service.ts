import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ApiConstants } from 'src/app/shared/constants';
import { Chat } from 'src/app/shared/models/chat.model';
import { Router } from '@angular/router';


@Injectable()
export class ChatService {
  constructor(private readonly http: HttpClient, private router: Router) { }

  token: string | undefined;

  setTokenInfo(tokenInfo: object) {
    sessionStorage.setItem('token-info', JSON.stringify(tokenInfo));
  }

  getTokenInfo() {
    var tokenInfo = sessionStorage.getItem('token-info');
    return tokenInfo ? JSON.parse(tokenInfo) : {};
  }

  getAccessToken() {
    var tokenInfo = sessionStorage.getItem('token-info');
    return tokenInfo ? JSON.parse(tokenInfo).accessToken : '';
  }

  getLoggedInUser() {
    var tokenInfo = sessionStorage.getItem('user-info');
    return tokenInfo ? JSON.parse(tokenInfo) : {};
  }

  setLoggedInUser(userInfo: object) {
    sessionStorage.setItem('user-info', JSON.stringify(userInfo));
  }

  getMessagingUser(userId: string) {
    var tokenInfo = sessionStorage.getItem(userId);
    return tokenInfo ? JSON.parse(tokenInfo) : {};
  }

  setMessagingUser(userId: string, userInfo: object) {
    sessionStorage.setItem(userId, JSON.stringify(userInfo));
  }

  deleteKeyFromSession(key: string) {
    sessionStorage.removeItem(key);
  }

  get(url: string, params: Object = new Object()) {
    const authHeader = new HttpHeaders({ Authorization: `Bearer ${this.getAccessToken()}` });
    return this.http.get<Chat[]>(url, {
      headers: authHeader,
      params: this.convertObjTOQueryParams(params)
    });
  }

  post(url: string, message: Object) {
    const authHeader = new HttpHeaders({ Authorization: `Bearer ${this.getAccessToken()}` });
    return this.http.post(url, message, { headers: authHeader });
  }

  convertObjTOQueryParams(queryParams: any) {
    let params = new HttpParams;
    if (queryParams) {
      for (let key in queryParams) {
        if (queryParams[key] instanceof Array) {
          queryParams[key].forEach((item: any) => {
            params = params.append(key.toString(), item);
          });
        }
        params = params.append(key.toString(), queryParams[key]);
      }
    }
    return params;
  }

  logout() {
    this.post(ApiConstants.LOGOUT, {
      "refreshToken": this.getTokenInfo().refreshToken
    }).subscribe({
      next: (res: any) => {
        this.router.navigate(["/login"]);
        sessionStorage.clear();
      }, error: (error: any) => {
        if(error.status == 401){
          this.router.navigate(["/login"]);
          sessionStorage.clear();
        }
      }
    })
  }
}
