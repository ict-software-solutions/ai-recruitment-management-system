import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { apiURL, LOGGED_IN_USER } from "app/util/constants";
import { map } from "rxjs/operators";
@Injectable({
  providedIn: "root",
})
export class AuthService {
  hasUserLoggedIn: boolean = false;

  constructor(private httpClient: HttpClient) { }

  signup(value, userId) {
    let url = apiURL.USER + "/" + value.userId;
    if (value.userId === 0) {
      return this.httpClient.post(apiURL.SIGNUP_URL, value);
    } else {
      return this.httpClient.put(url, value);
    }
  };

  login(param) {
    return this.httpClient.post(apiURL.LOGIN_URL, param).pipe(
      map((response: any) => {
        if (response["userId"] === undefined) {
          return false;
        }
        this.hasUserLoggedIn = true;
        const userInfo = { token: response["token"], userId: response["userId"] };
        sessionStorage.setItem(LOGGED_IN_USER, JSON.stringify(userInfo));
        return response;
      })
    );
  };

  isAuthenticated() {
    return this.hasUserLoggedIn;
  };

  resetPassword(param) {
    if (param.changePassword) {
      delete param.changePassword;
      return this.httpClient.post(apiURL.CHANGE_PASSWORD, param);
    } else {
      return this.httpClient.post(apiURL.RESET_PASSWORD_URL, param);
    }
  };

  changePassword(param) {
    return this.httpClient.post(apiURL.CHANGE_PASSWORD, param);
  };

  resendActivationMail(userName) {
    let url = apiURL.RESEND_EMAIL;
    let emailObject = { userName: userName };
    return this.httpClient.post(url, emailObject);
  };

  getUserById(access_token, userId) {
    const httpOptions = {
      headers: new HttpHeaders({ Authorization: "Bearer " + access_token }),
    };
    return this.httpClient.get(apiURL.USER + "/" + userId, httpOptions);
  };

  getProfileInfo(userId) {
    let url = apiURL.USER + "/" + userId;
    return this.httpClient.get(url);
  };

  updateProfileDetails(value, param) {
    let url = apiURL.USER + "/" + value.userId;
    if (value.userId === 0) {
      return this.httpClient.post(apiURL.ADDUSER_URL, value);
    } else {
      return this.httpClient.put(url, value);
    }
  };

  updateRolesInfo(value) {
    let url = apiURL.ROLES + "/" + value.roleId;
    if (value.roleId === 0) {
      return this.httpClient.post(apiURL.ROLES, value);
    } else {
      return this.httpClient.put(url, value);
    }
  }
  sendResetLink(emailAddress) {
    let url = apiURL.FORGOT_PASSWORD;
    let resendAddress = { emailAddress: emailAddress };
    return this.httpClient.post(url, resendAddress);
  }

  getAllUsers() {
    let url = apiURL.USER;
    return this.httpClient.get(url);
  }

  getAllInfo(object) {
    const httpOptions = {
      headers: new HttpHeaders({ Authorization: "Bearer " + object.token }),
    };
    let url = apiURL.USER + "/" + object.userId;
    return this.httpClient.get(url, httpOptions);
  }
  getAllInfo1(object) {
    const httpOptions = {
      headers: new HttpHeaders({ Authorization: "Bearer " + object.token }),
    };
    let url = apiURL.USER + "/" + object.userId;
    return this.httpClient.get(url, httpOptions);
  }

  deleteUser(userId) {
    let url = apiURL.USER + "/" + userId;
    return this.httpClient.delete(url);
  }
  deleteRole(roleId) {
    let url = apiURL.ROLES + "/" + roleId;
    return this.httpClient.delete(url);
  }
  getAllRoles() {
    let url = apiURL.ROLES;
    return this.httpClient.get(url);
  }

  getRoleList() {
    let url = apiURL.ROLES;
    return this.httpClient.get(url);
  }

  getAllRolesInfo(roleId) {
    let url = apiURL.ROLES + "/" + roleId;
    return this.httpClient.get(url);
  }

  getClientLogEntries() {
    let url = apiURL.CLIENT_LOG_URL;
    return this.httpClient.get(url);
  }

  getAuditLogEntries() {
    let url = apiURL.AUDIT_LOG_URL;
    return this.httpClient.get(url);
  }

  getConfig() {
    let url = apiURL.CONFIG_URL;
    return this.httpClient.get(url);
  }

  updateConfig(value, token) {
    const httpOptions = {
      headers: new HttpHeaders({ Authorization: "Bearer " + token }),
    };
    return this.httpClient.post(apiURL.UPDATE_CONFIG_URL, value);
  }

  resetConfig(value, token) {
    const httpOptions = {
      headers: new HttpHeaders({ Authorization: "Bearer " + token }),
    };
    return this.httpClient.post(apiURL.RESET_CONFIG_URL, value);
  }

  getConfigLogin(value, token) {
    const httpOptions = {
      headers: new HttpHeaders({ Authorization: "Bearer " + token }),
    };
    let object = {
      "userName" : value.userName,
      "password" : value.password
      };
    return this.httpClient.post(apiURL.VALIDATE_USER_URL, object);
  }

  getFieldHistory() {
    return this.httpClient.get(apiURL.FIELD_HISTORY_URL);
  }

  getSearchDataForLogEntries(object, token) {
    const httpOptions = {
      headers: new HttpHeaders({ Authorization: "Bearer " + token }),
    };
    let params = {
      "fromDate": object.fromDate,
      "toDate": object.toDate
    }
    let url;
    if (object.type === 'Audit Log') {
      url = apiURL.AUDITLOG_SEARCH_URL;
    } else if (object.type === 'Client Machine Log') {
      url = apiURL.CLIENTLOG_SEARCH_URL;
    } else {
      url = apiURL.FIELDHISTORY_SEARCH_URL;
    }
     return this.httpClient.post(url, params, httpOptions);
  }
  logout() {
    sessionStorage.clear();
    localStorage.clear();
    console.clear();
  }
}
