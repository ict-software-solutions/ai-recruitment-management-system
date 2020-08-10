import { Component, OnDestroy, OnInit, Inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatRadioModule } from "@angular/material/radio";
import { Subject } from "rxjs";
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { userDetails } from "app/models/user-details";
import {
  LOGGED_IN_USER_INFO,
  SIGNUP,
  EMAIL_PATTERN,
  IP_ADDRESS,
  USERNAME_PATTERN,
  MOBILENUMBER_PATTERN,
  LOG_LEVELS,
  LOG_MESSAGES,
  USER_TYPE,
} from "app/util/constants";
import { AirmsService } from "app/service/airms.service";
import { DatePipe } from "@angular/common";
import Swal from "sweetalert2";
import { usertype, rolename } from "app/models/user-type";
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from "app/service/user.service";
import { AuthService } from "app/service/auth.service";
import { LogService } from "app/service/shared/log.service";
declare var $: any;

@Component({
  selector: "forms",
  templateUrl: "./forms.component.html",
  styleUrls: ["./forms.component.scss"],
})
export class FormsComponent implements OnInit, OnDestroy {
  lastLogin: string;
  onFileSelected(event) {}
  userForm: FormGroup;
  dialogRef: any;
  showPassword = true;
  ResetPasswordSubscription: Subscription;
  getUserSubscription: Subscription;
  userUpdateSubscription: Subscription;
  getUserInfoSubscription: Subscription;
  updateUserSubscription: Subscription;
  hide = true;
  hide1 = true;
  hide2 = true;
  enableEdit = false;
  showPasswordsection = false;
  check = false;
  userInfo: userDetails;
  user: userDetails;
  userIpAddress: any;
  confirmDialogs: any;
  contactProfilePic: any;
  isLoading: false;
  userDetails: any;
  viewMode = true;
  userId = 0;
  labelPosition: "before" | "after" = "after";
  errorMessage = "";
  oldPasswordWrong = false;
  showForMyProfile = true;
  showForAddEditUser = true;
  isLoaded = false;
  roleLists: any;
  flagForScreen = "";
  usertypes = USER_TYPE;

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    public radio: MatRadioModule,
    private _formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router,
    private airmsService: AirmsService,
    private authService: AuthService,
    private logService: LogService
  ) {
    this.userInfo = airmsService.getSessionStorage(LOGGED_IN_USER_INFO);
    this.user = airmsService.getSessionStorage(SIGNUP);
    this.userIpAddress = airmsService.getIpAddressInfo();
    this.lastLogin = datePipe.transform(this.userInfo.lastLogin, "MMM dd, yyyy hh:mm:ss a");
    this.userUpdateSubscription = this.userService.userProfileUpdated$.subscribe((res) => {
      if (res !== null) {
        this.userForm.patchValue(res);
      }
    });
  }

  ngOnInit() {
    this.userForm = this._formBuilder.group({
      userId: ["", Validators.required],
      firstName: ["", Validators.required],
      middleName: [""],
      lastName: ["", Validators.required],
      emailAddress: ["", [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      mobileNumber: ["", [Validators.minLength(10), Validators.maxLength(14), Validators.pattern(MOBILENUMBER_PATTERN)]],
      companyname: [""],
      position: [""],
      address: [""],
      postalcode: [""],
      roleId: ["", Validators.required],
      userType: ["", Validators.required],
      city: [""],
      state: [""],
      country: [""],
      password: [""],
      newPassword: [""],
      check: [""],
      validFrom: [""],
      validTo: [""],
      passwordExpiry: [""],
      passwordSince: [""],
      userName: ["", [Validators.minLength(6), Validators.maxLength(30), Validators.required, Validators.pattern(USERNAME_PATTERN)]],
    });

    this.route.queryParams.subscribe((params) => {
      if (params["name"] === "addrole") {
        /** Add User */
        this.Edit();
        this.showForMyProfile = false;
        this.showForAddEditUser = false;
        this.userId = 0;
        this.flagForScreen = "addUser";
        this.userForm.controls["password"].setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(15)]);
        this.logUserActivity("User Management - Add", LOG_MESSAGES.CLICK);
      } else if (params["userId"] && params["userType"]) {
        /** Edit User */
        this.Edit();
        this.showForMyProfile = false;
        this.showForAddEditUser = false;
        this.userId = Number(params["userId"]);
        this.getUserInfo(this.userId);
        this.flagForScreen = "editUser";
        this.logUserActivity("User Management - Edit", LOG_MESSAGES.CLICK);
      } else {
        /** My Profile */
        this.userId = Number(params["userId"]);
        this.getUserInfo(this.userId);
        this.showForMyProfile = true;
        this.flagForScreen = "myProfile";
        this.enableEdit = false;
        this.viewMode = true;
        this.logUserActivity("User Management - My Profile", LOG_MESSAGES.CLICK);
      }
      this.getRoles();
    });
    this.userForm.get("password").valueChanges;
    this.userForm.controls["userId"].patchValue(this.userId);
  }

  unsubscribe(subscription: Subscription) {
    if (subscription !== null && subscription !== undefined) {
      subscription.unsubscribe();
    }
  }
  getRoles() {
    this.authService.getRoleList().subscribe(
      (res) => {
        this.logUserActivity("User Management - Fetching Roles", LOG_MESSAGES.SUCCESS);
        this.roleLists = res;
      },
      (error) => {
        this.logService.logError(LOG_LEVELS.ERROR, "User Management - Fetching Roles", "On Fetching Roles", JSON.stringify(error));
      }
    );
  }

  Edit() {
    this.logUserActivity("User Management - Edit My Profile", LOG_MESSAGES.CLICK);
    this.viewMode = false;
    this.enableEdit = !this.enableEdit;
  }

  getUserInfo(userId) {
    this.getUserInfoSubscription = this.authService.getProfileInfo(userId).subscribe(
      (res) => {
        this.userDetails = res;
        this.userForm.patchValue(res);
        this.userForm.controls["userType"].patchValue(this.userDetails.userType);
        this.userForm.controls["roleId"].patchValue(this.userDetails.roles.roleId);
        if (this.userDetails.profileImage !== null && this.userDetails.profileImage !== "") {
          this.userDetails.profileImage = atob(this.userDetails.profileImage);
          this.contactProfilePic = this.userDetails.profileImage;
          setTimeout(() => {
            $(".profile-image").remove();
            $("#photos").append(
              "<img src=" +
                "data:image/jpeg;base64" +
                this.userDetails.profileImage +
                ' class="profile-image avatar"  style="margin: -7px 8px -10px -7px;height:64px;width:64px;">'
            );
          }, 100);
        } else {
          setTimeout(() => {
            $(".profile-image").remove();
            $("#photos").append(
              '<img src="' +
                '../../assets/images/generic.jpg"' +
                'class="profile-image avatar"  style="margin: -7px 8px -10px -7px; height:64px;width:64px;">'
            );
          }, 100);
        }
      },
      (error) => {
        this.logService.logError(LOG_LEVELS.ERROR, "User Management - Fetching Users", "On Fetching Users", JSON.stringify(error));
      }
    );
  }

  canceledit() {
    this.logUserActivity("User Management - Cancel", LOG_MESSAGES.CLICK);
    if (this.flagForScreen === "myProfile") {
      this.getUserInfo(this.userId);
      this.showForMyProfile = true;
      this.showForAddEditUser = true;
      this.viewMode = true;
      this.enableEdit = !this.enableEdit;
    } else {
      this.router.navigate(["/apps/e-commerce/products"]);
    }
  }
  edit() {
    this.enableEdit == true;
  }
  emailChange(screenType, email) {
    if (screenType === "myProfile") {
      if (this.userInfo.emailAddress !== email) {
        this.logUserActivity("User Management - Modifying Email", LOG_MESSAGES.CLICK);
        Swal.fire({
          title: "Are you sure?",
          text: "You're trying to change Mail Id, So further notifications will be sent to you're new Mail Id",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.cancel) {
            this.userForm.controls["emailAddress"].patchValue(this.userInfo.emailAddress);
            this.logUserActivity("User Management - Cancelling modifying email", LOG_MESSAGES.CANCEL);
          } else {
            this.logUserActivity("User Management - Confirming email change", LOG_MESSAGES.YES);
          }
        });
      }
    }
  }
  updateProfile(value) {
    this.logUserActivity("User Management - Save", LOG_MESSAGES.CLICK);
    this.errorMessage = "";
    if (this.userForm.valid) {
      let updateObject = {
        firstName: value.firstName,
        middleName: value.middleName,
        lastName: value.lastName,
        emailAddress: value.emailAddress,
        mobileNumber: value.mobileNumber,
        company: value.companyname,
        address: value.address,
        city: value.city,
        state: value.state,
        postalCode: value.postalCode,
        userId: this.userId,
        passwordExpiry: value.passwordExpiry,
        userName: value.userName,
        userType: value.userType,
        roleId: value.roleId,
      };
      if (this.contactProfilePic !== null && this.contactProfilePic !== undefined && this.contactProfilePic !== "") {
        updateObject["profileImage"] = btoa(this.contactProfilePic);
      } else {
        updateObject["profileImage"] = null;
      }
      if (value.check === true) {
        if (this.userId != 0 && this.showForMyProfile === false) {
          updateObject["newPassword"] = value.newPassword;
          updateObject["lastIPAddress"] = this.userIpAddress;
        } else if (value.password != value.newPassword) {
          updateObject["password"] = value.password;
          updateObject["newPassword"] = value.newPassword;
          updateObject["lastIPAddress"] = this.userIpAddress;
        } else {
          Swal.fire({
            title: "New password cannot be the same as Old Password",
            icon: "warning",
            confirmButtonText: "Ok",
          });
          return;
        }
      } else {
        updateObject["password"] = value.password;
      }

      this.updateUserSubscription = this.authService.signup(updateObject, this.user).subscribe(
        (res) => {
          if (this.userId === Number(this.userInfo.userId)) {
            if (this.userForm.get("emailAddress").dirty || this.userForm.get("userName").dirty || this.userForm.get("newPassword").dirty) {
              Swal.fire({
                position: "center",
                icon: "warning",
                title: "You have made changes in Email or Username or Password",
                confirmButtonText: "Ok",
              });
              this.logoutAIRMS();
            } else {
              this.updateUserInLocalStorge(res);
              Swal.fire({
                title: "Profile Saved",
                icon: "success",
                confirmButtonText: "Ok",
              }).then((res) => {
                if (res.value === true) {
                  this.showForMyProfile = true;
                  this.showForMyProfile = true;
                  this.viewMode = true;
                  this.enableEdit = !this.enableEdit;
                }
              });
            }
          } else {
            Swal.fire({
              title: "Profile Saved",
              icon: "success",
              confirmButtonText: "Ok",
            }).then((res) => {
              if (res.value === true) {
                this.canceledit();
                this.router.navigate(["/apps/e-commerce/products"]);
              }
            });
          }
          if (this.flagForScreen === 'myProfile' || this.flagForScreen === 'editUser') {
          if (this.userForm.get("emailAddress").dirty) {
            this.logUserActivity('User Management - Edit', 'Email Modified From: '+ 
            this.userInfo.emailAddress +' To : '+ res['emailAddress']);
          }
          if (this.userForm.get("userName").dirty) {
            this.logUserActivity('User Management - Edit', 'UserName Modified');
          } 
          if (this.userForm.get("password").dirty) {
            this.logUserActivity('User Management - Edit', 'Password Modified');
          }
        }
        },
        (error) => {
          this.logService.logError(LOG_LEVELS.ERROR, "User Management - Save", "On updating user", JSON.stringify(error));
          if (error.error.message === "old password does not match") {
            this.errorMessage = error.error.message;
            this.oldPasswordWrong = true;
            Swal.fire({
              position: "center",
              icon: "warning",
              title: "Current password is wrong",
              showConfirmButton: true,
            });
          } else if (error.error.resCode === "EML-EXT") {
            Swal.fire({
              position: "center",
              icon: "warning",
              title: "Email already Exist",
              showConfirmButton: true,
            });
          } else if (error.error.resCode === "URN-EXT") {
            Swal.fire({
              position: "center",
              icon: "warning",
              title: "Username already exist",
              showConfirmButton: true,
            });
          } else if (error.error.resCode === "EML-EXT") {
            Swal.fire({
              position: "center",
              icon: "warning",
              title: "Email already Exist",
              showConfirmButton: true,
            });
          } else if (error.error.resCode === "URN-EXT") {
            Swal.fire({
              position: "center",
              icon: "warning",
              title: "Username already exist",
              showConfirmButton: true,
            });
          }
        }
      );
    } else {
      this.checkForFormFields();
    }
  }
  checkForFormFields() {
    for (const prop in this.userForm.controls) {
      if (Object.prototype.hasOwnProperty.call(this.userForm.controls, prop)) {
        if (this.userForm.controls[prop].pristine) {
          this.userForm.controls[prop].markAsTouched();
        }
      }
    }
  }
  setPassword(value) {
    this.userForm.controls["password"].patchValue(value.newPassword);
  }
  updateUserInLocalStorge(res) {
    let user_info = {
      userName: res["userName"],
      userType: res["userType"],
      userId: res["userId"],
      profileImage: res["profileImage"],
      emailAddress: res["emailAddress"],
      company: res["company"],
      firstName: res["firstName"],
      lastName: res["lastName"],
      roleId: this.userInfo["roleId"],
      roleName: this.userInfo["roleName"],
      lastLogin: this.userInfo["lastLogin"],
    };
    this.airmsService.setSessionStorage(LOGGED_IN_USER_INFO, user_info);
    this.userService.publishUserDetail(true);
  }
  changePassword(checked) {
    this.showPasswordsection = !this.showPasswordsection;
    if (checked === true) {
      this.logUserActivity("User Management - Selecting Change Password", LOG_MESSAGES.CLICK);
      if (this.flagForScreen == "editUser") {
        this.userForm.controls["newPassword"].setValidators([Validators.minLength(8), Validators.maxLength(15)]);
      } else if (this.flagForScreen == "myProfile") {
        this.userForm.controls["password"].setValidators([Validators.required]);
        this.userForm.controls["newPassword"].setValidators([Validators.minLength(8), Validators.maxLength(15)]);
      }
    } else {
      this.logUserActivity("User Management - Unselecting Change Password", LOG_MESSAGES.CLICK);
      this.userForm.controls["password"].clearValidators();
      this.userForm.controls["password"].updateValueAndValidity();
      this.userForm.controls["newPassword"].clearValidators();
      this.userForm.controls["newPassword"].updateValueAndValidity();
    }
  }
  onValueChange() {
    this.confirmDialogs = true;
  }
  uploadFile(e) {
    this.logUserActivity("User Management - Image Upload", LOG_MESSAGES.CLICK);
    const imageDetails = e.target.files[0];
    if (imageDetails.size > 30000 || (!imageDetails.type.includes("jpg") && !imageDetails.type.includes("jpeg"))) {
      this.logUserActivity("User Management - Image Upload", LOG_MESSAGES.FAILURE);
      Swal.fire({
        title: "<strong>Invalid Image Found</strong>",
        text: "Please upload a profile picture, jpg or jpeg, with size less than 30KB.",
        icon: "warning",
        confirmButtonText: "Ok",
      });
      return;
    } else {
      this.logUserActivity("User Management - Image Upload", LOG_MESSAGES.SUCCESS);
      const that = this;
      this.confirmDialogs = true;
      const reader = new FileReader();
      reader.onload = () => {
        that.contactProfilePic = reader.result;
        $(".profile-image").remove();
        $("#photos").append(
          "<img  src=" +
            "data:image/jpeg;base64" +
            reader.result +
            ' id ="img"  class="profile-image avatar"  style="margin: -7px 8px -10px -7px;height:64px;width:64px;">'
        );
      };
      reader.readAsDataURL(imageDetails);
      this.userForm.markAsDirty();
    }
  }
  getClipboardContent() {
    return window.navigator["clipboard"].readText();
  }

  logUserActivity(from, value) {
    this.logService.logUserActivity(LOG_LEVELS.INFO, from, value);
  }

  logoutAIRMS() {
    this.logUserActivity("Logout ", LOG_MESSAGES.CLICK);
    this.authService.logout();
    this.router.navigate([""]);
  }
  ngOnDestroy(): void {
    this.unsubscribe(this.getUserSubscription);
    this.unsubscribe(this.updateUserSubscription);
    this.unsubscribe(this.getUserInfoSubscription);
    this.contactProfilePic = null;
    this.showForMyProfile = null;
    this.viewMode = null;
    this.errorMessage = null;
    this.oldPasswordWrong = null;
    this.showForMyProfile = null;
    this.showForAddEditUser = null;
    this.isLoaded = null;
    this.roleLists = null;
    this.flagForScreen = null;
    this.userDetails = null;
  }
}

export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }
  const passwordNew = control.parent.get("passwordNew");
  const passwordConfirm = control.parent.get("passwordConfirm");
  if (!passwordNew || !passwordConfirm) {
    return null;
  }
  if (passwordConfirm.value === "") {
    return null;
  }
  if (passwordNew.value === passwordConfirm.value) {
    return null;
  }
  return { passwordsNotMatching: true };
};
