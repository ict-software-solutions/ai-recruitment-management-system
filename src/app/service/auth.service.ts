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
    console.log("getProfileinfo",userId);
    let url = apiURL.USER + "/" + userId
    return this.httpClient.get(url)
  }

  updateProfileDetails(value, param) {
    console.log("value", value);
    // console.log("")
    let url = apiURL.USER + "/" + value.id
    if(value.id === 0){
      console.log("if");
      return this.httpClient.post(apiURL.ADDUSER_URL,value)
    }
    else{
      console.log("else");
    return this.httpClient.put(url, value)
    }
  }

  
  updateRolesInfo(value){
console.log("value",value);
let url = apiURL.ROLES + "/" + value.roleId
return this.httpClient.put(url,value)
  }
  sendResetLink(emailAddress) {
    let url = apiURL.FORGOT_PASSWORD
    let resendAddress = { "emailAddress": emailAddress }
    return this.httpClient.post(url, resendAddress)
  }

  getAllUsers(object) {
    console.log('object', object);
    console.log("token", object.token);
    console.log("getAllUsers", this.getAllUsers);
    let url = apiURL.USER
    return this.httpClient.get(url)

  }

  getAllInfo(object) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Authorization': 'Bearer ' + object.token })
    };
    console.log("getAllinfo", object.userId);
    let url = apiURL.USER + "/" + object.userId
    return this.httpClient.get(url, httpOptions)
  }
  getAllInfo1(object) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Authorization': 'Bearer ' + object.token })
    };
    console.log("getAllinfo", object.userId);
    let url = apiURL.USER + "/" + object.userId
    return this.httpClient.get(url, httpOptions)
  }

  deleteUser(userId) {
    console.log(userId)
    let url = apiURL.USER + "/" + userId
    return this.httpClient.delete(url)
  }
  getAllRoles(object) {
    // const httpOptions ={
    //   headers:new HttpHeaders({'Authorization': 'Bearer ' + object.token}),
   
    // }; 
    console.log('object', object);
    console.log("token", object.token);
    console.log("getAllRoles", this.getAllRoles);
    let url = apiURL.ROLES
    return this.httpClient.get(url)

  }  
  getAllRolesInfo(roleId) {
    // const httpOptions = {
    //   headers: new HttpHeaders({ 'Authorization': 'Bearer ' + roleId.token })
    // };
    console.log("getroleId", roleId);
    let url = apiURL.ROLES + "/" + roleId
    return this.httpClient.get(url)
  }

  logout() {
    sessionStorage.clear();
    localStorage.clear();
    console.clear();
  }
}
