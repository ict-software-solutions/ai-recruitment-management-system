import { Component, OnDestroy, OnInit, Inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatRadioModule } from "@angular/material/radio";
import { Subject } from "rxjs";
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { takeUntil } from "rxjs/operators";
import { Subscription } from "rxjs";
import { userDetails } from "app/models/user-details";
import { LOGGED_IN_USER_INFO, SIGNUP, EMAIL_PATTERN, IP_ADDRESS } from "app/util/constants";
import { AirmsService } from "app/service/airms.service";
import { DatePipe } from "@angular/common";
import Swal from "sweetalert2";
import { usertype, rolename } from "app/models/user-type";
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from "app/service/user.service";
import { userInfo } from "os";
import { AuthService } from "app/service/auth.service";
import { __param } from "tslib";
declare var $: any;

@Component({
  selector: "forms",
  templateUrl: "./forms.component.html",
  styleUrls: ["./forms.component.scss"],
})
export class FormsComponent implements OnInit, OnDestroy {
  lastLogin: string;
  onFileSelected(event) { }
  form: FormGroup;
  dialogRef: any;
  showPassword = true;
  s;
  inboundClick = false;
  ResetPasswordSubscription: Subscription;
  getUserSubscription: Subscription;
  hide = true;
  hide1 = true;
  hide2 = true;
  private unsubscribeAll: Subject<any>;
  enableEdit = false;
  showPasswordsection = false;
  check = false;
  userInfo: userDetails;
  user: userDetails;
  userIpAddress: any;
  confirmDialogs: any;
  contactProfilePic: any;
  userProfileUpdateSubscription: Subscription;
  getProfileInfoSubscription: Subscription;
  updateProfileSubscription: Subscription;
  isLoading: false;
  profileDetails: any;
  viewMode = true;
  userId = 0;
  userType: "";
  name: "";
  labelPosition: "before" | "after" = "after";
  errorMessage = "";
  oldPasswordWrong = false;
  showForMyProfile = true;
  showForAddEditUser = true;
  status: "";
  Id = 0;
  resCode = "";
  isLoaded = false;
  roleLists: any;
  flagForScreen = '';
  usertypes: usertype[] = [{ value: "Employee" }, { value: "Client" }, { value: "Candidate" }];
  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    public radio: MatRadioModule,
    private _formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router,
    private airmsService: AirmsService,
    private authService: AuthService
  ) {
    this.userInfo = airmsService.getSessionStorage(LOGGED_IN_USER_INFO);
    this.user = airmsService.getSessionStorage(SIGNUP);
    this.userIpAddress = airmsService.getSessionStorage(IP_ADDRESS);
    this.lastLogin = datePipe.transform(this.userInfo.lastLogin, "MMM dd, yyyy hh:mm:ss a");
    this.unsubscribeAll = new Subject();
    this.errorMessage = "";
    this.userProfileUpdateSubscription = this.userService.userProfileUpdated$.subscribe((res) => {
      if (res !== null) {
        this.form.patchValue(res);
      }
    });
  }

  ngOnInit() {
    this.form = this._formBuilder.group({
      userId: ["", Validators.required],
      firstName: [""],
      middleName: [""],
      lastName: [""],
      emailAddress: ["", [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      mobileNumber: [""],
      companyname: [""],
      position: [""],
      address: [""],
      postalcode: [""],
      roleId: [""],
      userType: [""],
      city: [""],
      state: [""],
      country: [""],
      password: ["", Validators.required],
      newPassword: ["", [Validators.minLength(8), Validators.maxLength(15)]],
      check: [""],
      validFrom: [""],
      validTo: [""],
      passwordExpiry: [""],
      passwordSince: [""],
      passwordNew: ["", [Validators.minLength(8), Validators.maxLength(15)]],
      userName: ["", [Validators.minLength(6), Validators.maxLength(30)]],
    });

    this.route.queryParams.subscribe((params) => {
      if (params["name"] === "addrole") {
        /** Add User */
        this.Edit();
        this.showForMyProfile = false;
        this.showForAddEditUser = false;
        this.userId = 0;
        this.flagForScreen = 'addUser';
      } else if (params["userId"] && params["userType"]) {
        /** Edit User */
        this.Edit();
        this.showForMyProfile = false;
        this.showForAddEditUser = false;
        this.userId = Number(params["userId"]);
        this.getProfileInfo(this.userId);
        this.flagForScreen = 'editUser';
      } else {
        /** My Profile */
        this.userId = Number(params["userId"]);
        this.getProfileInfo(this.userId);
        this.showForMyProfile = true;
        this.flagForScreen = 'myProfile';
        this.enableEdit = false;
        this.viewMode = true;
      }
      this.getRoles();
    });
    this.form.get("password").valueChanges;
    this.form
      .get("password")
      .valueChanges.pipe(takeUntil(this.unsubscribeAll))
      .subscribe(() => {
        this.form.get("passwordConfirm").updateValueAndValidity();
      });
  }

  unsubscribe(subscription: Subscription) {
    if (subscription !== null && subscription !== undefined) {
      subscription.unsubscribe();
    }
  }
  getRoles() {
    this.authService.getRoleList().subscribe((res) => {
      this.roleLists = res;
    });
  }

  Edit() {
    this.viewMode = false;
    this.enableEdit = !this.enableEdit;
  }

  getProfileInfo(userId) {
   // this.ngOnInit();
    this.getProfileInfoSubscription = this.authService.getProfileInfo(userId).subscribe((res) => {
      this.profileDetails = res;
      this.form.patchValue(res);
      this.form.controls["userType"].patchValue(this.profileDetails.userType);
      this.form.controls["roleId"].patchValue(this.profileDetails.roles.roleId);
      if (this.profileDetails.profileImage !== null && this.profileDetails.profileImage !== "") {
        this.profileDetails.profileImage = atob(this.profileDetails.profileImage);
        this.contactProfilePic = this.profileDetails.profileImage;
        setTimeout(() => {
          $(".profile-image").remove();
          $("#photos").append(
            "<img src=" +
            "data:image/jpeg;base64" +
            this.profileDetails.profileImage +
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
    });
  }

  canceledit() {
    if (this.flagForScreen === 'myProfile') {
      this.getProfileInfo(this.userId);
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
  updateProfile(value) {
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
      updateObject["password"] = value.newPassword;
    }

    this.updateProfileSubscription = this.authService.updateProfileDetails(updateObject, this.user).subscribe(
      (res) => {
        if (this.userId === Number(this.userInfo.userId)) {
          if (this.form.get('emailAddress').dirty || this.form.get('userName').dirty || this.form.get('newPassword').dirty) {
            Swal.fire({
              position: "center",
              icon: "warning",
              title: "You have made changes in Email or Username or Password",
              confirmButtonText: "Ok"
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
      },

      (error) => {
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
      lastLogin: this.userInfo["lastLogin"]
    }
    this.airmsService.setSessionStorage(LOGGED_IN_USER_INFO, user_info);
    this.userService.publishUserDetail(true);
  }
  changePassword(checked) {
    this.showPasswordsection = !this.showPasswordsection;
  }
  onValueChange() {
    this.confirmDialogs = true;
  }
  uploadFile(e) {
    const imageDetails = e.target.files[0];
    console.log('imageDetails', imageDetails.size, !imageDetails.type.includes("jpeg"));
    if (imageDetails.size > 30000 || (!imageDetails.type.includes("jpg") && !imageDetails.type.includes("jpeg"))) {
      Swal.fire({
        title: "<strong>Invalid Image Found</strong>",
        text: "Please upload a profile picture, jpg or jpeg, with size less than 30KB.",
        icon: "warning",
        confirmButtonText: "Ok",
      });
      return;
    } else {
      const that = this;
      this.confirmDialogs = true;
      const reader = new FileReader();
      reader.onload = () => {
        that.contactProfilePic = reader.result;
        $(".profile-image").remove();
        $("#photos").append(
          "<img  src=" + 'data:image/jpeg;base64' +
          reader.result +
          ' id ="img"  class="profile-image avatar"  style="margin: -7px 8px -10px -7px;height:64px;width:64px;">'
        );
      };
      reader.readAsDataURL(imageDetails);
      this.form.markAsDirty();
    }
  }
  getClipboardContent() {
    return window.navigator["clipboard"].readText();
  }

  logoutAIRMS() {
    this.authService.logout();
    this.router.navigate(['']);
  }
  ngOnDestroy(): void {
    this.unsubscribe(this.getUserSubscription);
    this.unsubscribe(this.updateProfileSubscription);
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
    this.contactProfilePic = null;
    this.showForMyProfile = null;
    this.viewMode = null;
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
