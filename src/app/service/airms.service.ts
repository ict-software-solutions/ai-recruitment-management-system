import { Injectable } from "@angular/core";
import { LOGGED_IN_USER_INFO, IP_ADDRESS } from "app/util/constants";

@Injectable({
  providedIn: "root",
})
export class AirmsService {
  constructor() {}

  setSessionStorage(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  getSessionStorage(key) {
    return JSON.parse(sessionStorage.getItem(key));
  }

  getUserInfo() {
    return this.getSessionStorage(LOGGED_IN_USER_INFO);
  }

  getIpAddressInfo() {
    return this.getSessionStorage(IP_ADDRESS);
  }
  getToken() {
    const user = this.getUserInfo();
    if (user !== undefined && user !== null) {
      return user["token"];
    }
  }

  getUserRole() {
    const user = this.getUserInfo();
    if (user !== undefined && user !== null) {
      return user["roleName"];
    }
  }
  getUserRoleScreenMap() {
    const user = this.getUserInfo();
    if(user !== undefined && user!== null) {
      return user['screenMapping']
    }
  }

  getUserId() {
    const user = this.getUserInfo();
    if (user !== undefined && user !== null) {
      return user["userId "];
    }
  }

  getUserName() {
    const user = this.getUserInfo();
    if (user !== undefined && user !== null) {
      return user['userName']
    }
  }
  getUserFirstLastName() {
    const user = this.getUserInfo();
    if (user !== undefined && user !== null) {
      return user['firstName'] +" " + user['lastName'];
    }
  }

  public getBrowserName() {
    const agent = window.navigator.userAgent;
    if (/msie\s|trident\/|edge\//i.test(agent) || agent.indexOf("OPR") !== -1 || agent.indexOf("Edg") !== -1) {
      return false;
    } else if (agent.indexOf("Chrome") !== -1 || agent.indexOf("Firefox") !== -1) {
      return true;
    } else {
      return false;
    }
  }
}
