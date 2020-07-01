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
      "userType":value.userType,
      "firstName": value.firstName,
      "userName": value.userName,
      "lastName": value.lastName,
      "emailAddress": value.emailAddress,
      "password": value.password
    }
    return this.httpClient.post(apiURL.SIGNUP_URL, param)
  }

  login(param) {
    return this.httpClient.post(apiURL.LOGIN_URL, param);
  }

  // changePassword(value) {
  //   const param = {
  //     "emailAddress": value.email,
  //     "password": value.password,
  //     'NewPassword': value.NewPassword
  //   }
  //   return this.httpClient.post(apiURL.CHANGE_PASSWORD_URL, param);
  // }
edituser(value){
  const param = {
    "firstName": value.firstName,
    "middleName": value.middleName,
    "lastName": value.lastName,
    "emailAddress": value.emailAddress,
    "mobileNumber": value.mobile,
    "company":value.company ,
    "address": value.address,
    "city": value.city,
    "state": value.state,
    "postalCode":value.postalCode,
    "password": value.password,
    "newPassword": value.newPassword
  }
  return this.httpClient.post(apiURL.EDITUSER_URL, param)
}



  getUserById(access_token, userId) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Authorization': 'Bearer ' + access_token })
    };
    return this.httpClient.get(apiURL.USER + '/' + userId, httpOptions);
  }

  logout() {
    sessionStorage.clear();
    localStorage.clear();
    console.clear();
  }
}
