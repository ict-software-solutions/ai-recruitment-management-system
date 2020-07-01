import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { AirmsService } from 'app/service/airms.service';
import { LogService } from 'app/service/shared/log.service';
import { LAYOUT_STRUCTURE, LOGGED_IN_USER, LOG_LEVELS, LOG_MESSAGES, TROY_LOGO, LOGGED_IN_USER_INFO } from 'app/util/constants';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../service/auth.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class LoginComponent implements OnInit, OnDestroy {
    loginForm: FormGroup;
    logoPath = TROY_LOGO;
    hide = true;
    invalidData = true;
    loginSubscription: Subscription;
    getUserSubscription: Subscription;
    showResetContent = false;
    inActive = false;
    errorMessage = '';
    unsupportedBrowser: boolean;

    constructor(
        private fuseConfigService: FuseConfigService,
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private airmsService: AirmsService,
        private logService: LogService) {
        this.fuseConfigService.config = LAYOUT_STRUCTURE;
        const browserType = this.airmsService.getBrowserName();
        if (!browserType) {
            const notSupportBrowser = {
                title: '<strong>Unsupported Browser</strong>',
                text: 'Please use latest version of “Firefox” or “Chrome”',
            };
            const areyousure = this.airmsService.swalOKButton(notSupportBrowser);
            Swal.fire(areyousure).then(() => {
                this.unsupportedBrowser = true;
            });
        }
    }

    ngOnInit(): void {
        this.loginForm = this.formBuilder.group({
            userName: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]]
        });
    }

    login(value) {
        this.logUserActivity('LOGIN', LOG_MESSAGES.CLICK);
        this.inActive = true;
        this.errorMessage = '';
        this.loginSubscription = this.authService.login(value).subscribe(res => {
            this.logUserActivity('LOGIN', LOG_MESSAGES.SUCCESS);
            const userInfo = { token: res['token'], userId: res['userId'] };
            this.airmsService.setSessionStorage(LOGGED_IN_USER, userInfo);
            this.getUserSubscription = this.authService.getUserById(res['token'], res['userId']).
                subscribe(userDetails => {
                    let user_info = {
                        userName: userDetails['userName'],
                        userType: userDetails['userType'],
                        profileImage: userDetails['profileImage'],
                        emailAddress: userDetails['emailAddress'],
                        company: userDetails['company'],
                        firstName: userDetails['firstName'],
                        lastName: userDetails['lastName'],
                        lastLogin: userDetails['lastLogin']
                    }
                    this.airmsService.setSessionStorage(LOGGED_IN_USER_INFO, user_info)
                    this.logUserActivity('Login - fetch user', LOG_MESSAGES.SUCCESS);
                    this.router.navigate(['../../apps/dashboards/analytics']);
                    this.loginSubscription.unsubscribe();
                }, error => {
                    this.logService.logError(LOG_LEVELS.ERROR, 'Login page', 'On Fetch User', JSON.stringify(error));
                });
        }, error => {
            if (error.error.message === 'Account Inactive. Please contact admin') {
                this.errorMessage = error.error.message;
                this.inActive = true;
            } else if (error.status === 400) {
                this.invalidData = false;
            }
            this.logUserActivity('Login Page', LOG_MESSAGES.FAILURE);
            this.logService.logError(LOG_LEVELS.ERROR, 'Login page', 'On Try Login', JSON.stringify(error));
        });
    }

    logUserActivity(from, value) {
        this.logService.logUserActivity(LOG_LEVELS.INFO, from, value);
    }

    unsubscribe(subscription: Subscription) {
        if (subscription !== null && subscription !== undefined) {
            subscription.unsubscribe();
        }
    }

    ngOnDestroy() {
        // this.unsubscribe(this.loginSubscription);
        this.unsubscribe(this.getUserSubscription);
        this.loginForm = null;
        this.fuseConfigService = null;
        this.formBuilder = null;
        this.logoPath = null;
        this.authService = null;
        this.router = null;
        this.airmsService = null;
        this.logService = null;
        this.hide = null;
        this.invalidData = null;
        this.showResetContent = null;
        this.inActive = null;
        this.errorMessage = null;
    }

}
