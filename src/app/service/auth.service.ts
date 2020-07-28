import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiURL } from 'app/util/constants';
import { CalendarUtils } from 'angular-calendar';
import { Observable } from 'rxjs';
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

  resetPassword(param) {
    if (param.changePassword) {
      delete param.changePassword;
      return this.httpClient.post(apiURL.CHANGE_PASSWORD, param);
    } else {
      return this.httpClient.post(apiURL.RESET_PASSWORD_URL, param);
    }
  }

  changePassword(param) {
    return this.httpClient.post(apiURL.CHANGE_PASSWORD, param);
  }

  resendActivationMail(userName) {
    let url = apiURL.RESEND_EMAIL
    let emailObject = { "userName": userName }
    return this.httpClient.post(url, emailObject)
  }

  getUserById
    (access_token, userId) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Authorization': 'Bearer ' + access_token })
    };
    return this.httpClient.get(apiURL.USER + '/' + userId, httpOptions);
  }

  getProfileInfo(userId) {
    let url = apiURL.USER + "/" + userId
    return this.httpClient.get(url)
  }

  updateProfileDetails(value, param) {
    let url = apiURL.USER + "/" + value.userId
    if (value.userId === 0) {
      return this.httpClient.post(apiURL.ADDUSER_URL, value)
    }
    else {
      return this.httpClient.put(url, value)
    }
  }

  updateRolesInfo(value) {
    let url = apiURL.ROLES + "/" + value.roleId
    if (value.roleId === 0) {
      return this.httpClient.post(apiURL.ROLES, value)
    }
    else {
      return this.httpClient.put(url, value)
    }
  }
  sendResetLink(emailAddress) {
    let url = apiURL.FORGOT_PASSWORD
    let resendAddress = { "emailAddress": emailAddress }
    return this.httpClient.post(url, resendAddress)
  }

  getAllUsers(object) {
    let url = apiURL.USER
    return this.httpClient.get(url)

  }

  getAllInfo(object) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Authorization': 'Bearer ' + object.token })
    };
    let url = apiURL.USER + "/" + object.userId
    return this.httpClient.get(url, httpOptions)
  }
  getAllInfo1(object) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Authorization': 'Bearer ' + object.token })
    };
    let url = apiURL.USER + "/" + object.userId
    return this.httpClient.get(url, httpOptions)
  }

  deleteUser(userId) {
    let url = apiURL.USER + "/" + userId
    return this.httpClient.delete(url)
  }
  deleteRole(roleId) {
    let url = apiURL.ROLES + "/" + roleId
    return this.httpClient.delete(url)
  }
  getAllRoles(object) {
    let url = apiURL.ROLES
    return this.httpClient.get(url)
  }

  getRoleList() {
    let url = apiURL.ROLES
    return this.httpClient.get(url)
  }

  getAllRolesInfo(roleId) {
    let url = apiURL.ROLES + "/" + roleId
    return this.httpClient.get(url)
  }

  logout() {
    sessionStorage.clear();
    localStorage.clear();
    console.clear();
  }
}
