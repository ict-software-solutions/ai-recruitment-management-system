import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiURL } from 'app/util/constants';
import { BehaviorSubject, observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private httpClient: HttpClient) { }

  signup(value) {
    const param = {
      "userType": value.userType,
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

  private userProfileUpdateSub = new BehaviorSubject<any>(null);
  userProfileUpdated$ = this.userProfileUpdateSub.asObservable();
  userProfileUpdateDone(value) {
    this.userProfileUpdateSub.next(value);
  }

  resendActivationMail(userName) {
    let url = apiURL.RESEND_EMAIL
    let emailObject = { "userName": userName }
    return this.httpClient.post(url, emailObject)
  }

  getUserById(access_token, userId) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Authorization': 'Bearer ' + access_token })
    };
    return this.httpClient.get(apiURL.USER + '/' + userId, httpOptions);
  }

  getProfileInfo(object) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Authorization': 'Bearer ' + object.token })
    };
    console.log("getProfileinfo", object.userId);
    let url = apiURL.USER + "/" + object.userId

    return this.httpClient.get(url, httpOptions)
  }

  updateProfileDetails(value, user) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Authorization': 'Bearer ' + user.token })
    };
    console.log("value", value);
    value.id=value.userId;
    let url = apiURL.USER + "/" + value.userId
    return this.httpClient.put(url, value, httpOptions)
  }
  sendResetLink(emailAddress){
    let url=apiURL.FORGOT_PASSWORD
    let resendAddress ={"emailAddress":emailAddress}
    return this.httpClient.post(url,resendAddress)
  }

  logout() {
    sessionStorage.clear();
    localStorage.clear();
    console.clear();
  }
}
