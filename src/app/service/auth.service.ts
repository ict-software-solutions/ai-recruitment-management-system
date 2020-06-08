import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiURL } from 'app/util/constants';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private httpClient: HttpClient) { }
  signup(value) {
    const param = {
      "name": value.name,
      "email": value.email,
      "password": value.password
    }
    return this.httpClient.post(apiURL.user, param)
  }
  login(value) {
    const param = {

      "email": value.email,
      "password": value.password
    }
    return this.httpClient.post(apiURL.login, param);
  }
}
