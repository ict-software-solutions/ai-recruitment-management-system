import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiURL } from 'app/util/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private httpClient: HttpClient) { }
  signup(value) {
    const param = {
      "firstName": value.firstName,
      "userName": value.userName,
      "lastName": value.lastName,
      "emailAddress": value.email,
      "password": value.password
    }
    return this.httpClient.post(apiURL.SIGNUP_URL, param)
  }

  login(param) {
    return this.httpClient.post(apiURL.LOGIN_URL, param);
  }

  changePassword(value) {
    const param = {
      "emailAddress": value.email,
      "password": value.password,
      'NewPassword': value.NewPassword
    }
    return this.httpClient.post(apiURL.CHANGE_PASSWORD_URL, param);
  }

  getUserById(access_token, userId) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Authorization': access_token })
    };
    return this.httpClient.get(apiURL.USER + '/' + userId, httpOptions);
  }
}
