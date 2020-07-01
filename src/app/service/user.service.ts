import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiURL } from 'app/util/constants';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

private userProfileUpdateSub = new BehaviorSubject<any>(null);
userProfileUpdated$ = this.userProfileUpdateSub.asObservable();

// userUpdateDone(value){
//   this.userUpdateSub
// }

userProfileUpdateDone(value){
this.userProfileUpdateSub.next(value);
}
}
// getLoggedInUserType(value){

// }