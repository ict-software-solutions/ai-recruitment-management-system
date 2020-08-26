import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { fuseAnimations } from "@fuse/animations";
import { FuseConfigService } from "@fuse/services/config.service";
import { AirmsService } from "app/service/airms.service";
import { LogService } from "app/service/shared/log.service";
import { IP_ADDRESS, LAYOUT_STRUCTURE, LOGGED_IN_USER_INFO, LOG_LEVELS, LOG_MESSAGES, TROY_LOGO, CONFIG_DATA } from "app/util/constants";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import { AuthService } from "../../../../service/auth.service";
declare var $: any;
declare var jQuery: any;
export interface DialogData {
  displayMessage: string;
}
@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class LoginComponent implements OnInit, OnDestroy {
  displayMessage: string;
  loginForm: FormGroup;
  logoPath = TROY_LOGO;
  hide = true;
  invalidData = true;
  loginSubscription: Subscription;
  getUserSubscription: Subscription;
  getConfigSubscription: Subscription;
  showResetContent = false;
  passwordExpired = false;
  inActive = false;
  errorMessage = "";
  reCaptcha = false;
  unsupportedBrowser: boolean;
  status = "";
  loginClicked = false;

  constructor(
    private fuseConfigService: FuseConfigService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private airmsService: AirmsService,
    private route: ActivatedRoute,
    private logService: LogService
  ) {
    this.fuseConfigService.config = LAYOUT_STRUCTURE;
    const browserType = this.airmsService.getBrowserName();
    if (!browserType) {
      const notSupportBrowser = {
        title: "<strong>Unsupported Browser</strong>",
        text: "Please use latest version of “Firefox” or “Chrome”",
      };
      // const areyousure = this.airmsService.swalOKButton(notSupportBrowser);
      // Swal.fire(areyousure).then(() => {
      //   this.unsupportedBrowser = true;
      // });
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      userName: ["", Validators.required],
      password: ["", [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
    });
    const firstParam: string = this.route.snapshot.queryParamMap.get("status");
    if (firstParam === '"active"') {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your account has been activated successfully",
        showConfirmButton: true,
      });
    }

    const type: string = this.route.snapshot.queryParamMap.get("type");
    const email = this.route.snapshot.queryParamMap.get("email");
    const token = this.route.snapshot.queryParamMap.get("token");
    if (type === '"resetPassword"') {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          type,
          email,
          token,
        },
        skipLocationChange: true,
      };
      this.router.navigate(["/pages/auth/reset-password"], navigationExtras);
    }
    this.getSystemIp();
  }
  getSystemIp() {
    $.getJSON("https://api64.ipify.org?format=json", (data) => {
      sessionStorage.setItem(IP_ADDRESS, JSON.stringify(data.ip));
    });
  }

  login(value) {
    this.loginClicked = true;
    this.invalidData = true;
    this.logUserActivityForEmail("LOGIN", value.userName, LOG_MESSAGES.CLICK);
    this.inActive = true;
    this.errorMessage = "";
    let loginInfo: any;
    this.loginSubscription = this.authService.login(value).subscribe(
      (res) => {
        console.log('res', res);
        this.logUserActivityForEmail("LOGIN", value.userName, LOG_MESSAGES.SUCCESS);
        loginInfo = res;
        if(res["userId"] !== undefined) {
        this.getUserSubscription = this.authService.getUserById(res["token"], res["userId"]).subscribe(
         async (userDetails) => {
            await this.getConfig();
            let user_info = {
              userName: userDetails["userName"],
              userType: userDetails["userType"],
              userId: userDetails["userId"],
              profileImage: userDetails["profileImage"],
              emailAddress: userDetails["emailAddress"],
              company: userDetails["company"],
              firstName: userDetails["firstName"],
              lastName: userDetails["lastName"],
              roleId: userDetails["roles"]["roleId"],
              roleName: userDetails["roles"]["roleName"],
              screenMapping: userDetails['roles']['screenMapping'],
              lastLogin: loginInfo["lastLogin"],
              token: loginInfo['token']
            };
            this.airmsService.setSessionStorage(LOGGED_IN_USER_INFO, user_info);
            this.logUserActivityForEmail("Login - fetch user", value.userName, LOG_MESSAGES.SUCCESS);
            this.router.navigate(["../../apps/dashboards/analytics"]);
            this.loginSubscription.unsubscribe();
          }, (error) => {
            this.logService.logErrorForEmail(LOG_LEVELS.ERROR, value.userName, "Login page", "On Fetch User", JSON.stringify(error));
          }
        
        );
        } else {
          this.loginClicked = false;
          if(res === false) {
          this.invalidData = false;
          } else {
          this.errorResponse(res, value);
          }
        }
      },
      (error) => {
        console.log('error', error);
        this.loginClicked = false;
        this.errorResponse(error.error, value);
      //   if (error.error.resCode === "PWD-EXPD") {
      //     this.passwordExpired = true;
      //     Swal.fire({
      //       title: "Password expired. Please change the password",
      //       icon: "warning",
      //       confirmButtonText: "Reset Your Password",
      //     }).then(() => {
      //       let navigationExtras: NavigationExtras = {
      //         queryParams: {
      //           userName: this.loginForm.get("userName").value,
      //         },
      //         skipLocationChange: true,
      //       };
      //       this.router.navigate(["/pages/auth/reset-password"], navigationExtras);
      //     });
      //   } else if (error.error.message === "Invalid Password You-have-2-attempts") {
      //     this.errorMessage = error.error.message;
      //     this.reCaptcha = true;
      //   } else if (error.error.message === "Invalid Password You-have-1-attempts") {
      //     this.reCaptcha = true;
      //     Swal.fire({
      //       position: "center",
      //       icon: "warning",
      //       title: "One more attempt remaining",
      //       text: "If login is unsuccessfull,Your account will be locked",
      //       confirmButtonText: "OK",
      //     });
      //   } else if (
      //     error.error.message === "Account Locked, Please contact support" ||
      //     error.error.message === "Invalid Password You-have-0-attempts"
      //   ) {
      //     this.inActive = true;
      //     Swal.fire({
      //       position: "center",
      //       icon: "error",
      //       title: "Account Locked, Please contact support",
      //       confirmButtonText: "OK",
      //     });
      //   } else if (error.error.message === "Account Inactive") {
      //     Swal.fire({
      //       title: "Activation",
      //       text: "Please consider activating your account",
      //       icon: "warning",
      //       showCancelButton: true,
      //       cancelButtonText: "Ok",
      //       cancelButtonColor: "#008ae6",
      //       confirmButtonText: "Resend Mail",
      //     }).then((res) => {
      //       if (res.value === true) {
      //         this.resend();
      //       }
      //     });
      //     this.inActive = true;
      //   } else if (error.status === 400) {
      //     if (error.error.message === 'Role InActive') {
      //       Swal.fire({
      //         position: "center",
      //         icon: "warning",
      //         title: "User Role is Inactive",
      //         text: "Please contact support",
      //         confirmButtonText: "OK",
      //       });
      //       if (error.error.resCode === '"AC-INA"') {
      //         Swal.fire({
      //           position: "center",
      //           icon: "warning",
      //           title: "Invalid Account",
      //           text: "Please contact support",
      //           confirmButtonText: "OK",
      //         });
      //       }
      //     } else {
      //     this.invalidData = false;
      //     }
      //   }
      //   this.logUserActivityForEmail("Login Page", value.userName, LOG_MESSAGES.FAILURE);
      //   this.logService.logErrorForEmail(LOG_LEVELS.ERROR, value.userName, "Login page", "On Try Login", JSON.stringify(error));
       }
    );
  }

  errorResponse(error, value) {
    console.log('error Response', error, value);
    this.loginClicked = false;
    if (error.resCode === "PWD-EXPD") {
      this.passwordExpired = true;
      Swal.fire({
        title: "Password expired. Please change the password",
        icon: "warning",
        confirmButtonText: "Reset Your Password",
      }).then(() => {
        let navigationExtras: NavigationExtras = {
          queryParams: {
            userName: this.loginForm.get("userName").value,
          },
          skipLocationChange: true,
        };
        this.router.navigate(["/pages/auth/reset-password"], navigationExtras);
      });
    } else if (error.message === "Invalid Password You-have-2-attempts") {
      this.errorMessage = error.message;
      this.reCaptcha = true;
    } else if (error.message === "Invalid Password You-have-1-attempts") {
      this.reCaptcha = true;
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "One more attempt remaining",
        text: "If login is unsuccessfull,Your account will be locked",
        confirmButtonText: "OK",
      });
    } else if (
      error.message === "Account Locked, Please contact support" ||
      error.message === "Invalid Password You-have-0-attempts"
    ) {
      this.inActive = true;
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Account Locked, Please contact support",
        confirmButtonText: "OK",
      });
    } else if (error.message === "Account Inactive") {
      Swal.fire({
        title: "Activation",
        text: "Please consider activating your account",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Ok",
        cancelButtonColor: "#008ae6",
        confirmButtonText: "Resend Mail",
      }).then((res) => {
        if (res.value === true) {
          this.resend();
        }
      });
      this.inActive = true;
    } else if (error.status === 400) {
      if (error.message === 'Role InActive') {
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "User Role is Inactive",
          text: "Please contact support",
          confirmButtonText: "OK",
        });
        if (error.resCode === '"AC-INA"') {
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "Invalid Account",
            text: "Please contact support",
            confirmButtonText: "OK",
          });
        }
      } else {
      this.invalidData = false;
      }
    }
    this.logUserActivityForEmail("Login Page", value.userName, LOG_MESSAGES.FAILURE);
    this.logService.logErrorForEmail(LOG_LEVELS.ERROR, value.userName, "Login page", "On Try Login", JSON.stringify(error));
  }
  getConfig() {
    return new Promise(resolve=>{
    this.getConfigSubscription = this.authService.getConfig().subscribe((res:any) => {
      console.log('res', res);
      let configData = {
        'setTimeout': Number(res.sessionTimeoutMins)
      }
      console.log('config', configData);
      this.airmsService.setSessionStorage(CONFIG_DATA, JSON.stringify(configData));
    resolve(true);
    });
  });
  }
  resend() {
    this.errorMessage = "";
    this.authService.resendActivationMail(this.loginForm.value.userName).subscribe((res: any) => {
      if (res.message === "activation link send successfully") {
        Swal.fire({
          title: "Activation link sent to your mail successfully",
          icon: "success",
          showConfirmButton: true,
        });
      }
    });
  }

  logUserActivityForEmail(from, emailAddress, value) {
    this.logService.logUserActivityForEmail(LOG_LEVELS.INFO, emailAddress, from, value);
  }
  unsubscribe(subscription: Subscription) {
    if (subscription !== null && subscription !== undefined) {
      subscription.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.unsubscribe(this.getUserSubscription);
    this.loginForm = null;
    this.fuseConfigService = null;
    this.formBuilder = null;
    this.logoPath = null;
    this.authService = null;
    this.router = null;
  //  this.airmsService = null;
    this.logService = null;
    this.hide = null;
    this.invalidData = null;
    this.showResetContent = null;
    this.inActive = null;
    this.errorMessage = null;
    this.reCaptcha = null;
    this.passwordExpired = null;
  }
}
