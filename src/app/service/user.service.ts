import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { apiURL } from 'app/util/constants';
import { BehaviorSubject, observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private httpClient: HttpClient) { }
  private userProfileUpdateSub = new BehaviorSubject<any>(null);
  userProfileUpdated$ = this.userProfileUpdateSub.asObservable();
}
export class UserDetailService {
  constructor(private httpClient: HttpClient) { }
  private userDetailUpdateSub = new BehaviorSubject<any>(null);
  userDetailUpdated$ = this.userDetailUpdateSub.asObservable();
}

