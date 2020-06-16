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

  getUserById(access_token, userId) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Authorization': access_token })
    };
    return this.httpClient.get(apiURL.user + '/' + userId, httpOptions);
  }
}
