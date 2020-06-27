import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AirmsService {
  [x: string]: any;

  constructor() { }

  setSessionStorage(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  getSessionStorage(key) {
    return JSON.parse(sessionStorage.getItem(key));
  }
  public getBrowserName() {
    const agent = window.navigator.userAgent;
    if (/msie\s|trident\/|edge\//i.test(agent) || agent.indexOf('OPR') !== -1 || agent.indexOf('Edg') !== -1) {
      return false;
    } else if (agent.indexOf('Chrome') !== -1 || agent.indexOf('Firefox') !== -1) {
      return true;
    } else {
      return false;
    }
  }
}
