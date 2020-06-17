import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { AirmsService } from 'app/service/airms.service';
import { LogService } from 'app/service/shared/log.service';
import { LAYOUT_STRUCTURE, LOGGED_IN_USER, LOG_LEVELS, TROY_LOGO, EMAIL_PATTERN } from 'app/util/constants';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../service/auth.service';

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

    constructor(
        private fuseConfigService: FuseConfigService,
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private airmsService: AirmsService,
        private logService: LogService
    ) {
        this.fuseConfigService.config = LAYOUT_STRUCTURE;
    }

    ngOnInit(): void {
        this.loginForm = this.formBuilder.group({
            email: ['sample@gmail.com', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
            password: ['sample123', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]]
        });
    }

    login(value) {
        this.loginSubscription = this.authService.login(value).subscribe(res => {
            const userInfo = { token: res['id'], userId: res['userId'] };
            this.airmsService.setSessionStorage(LOGGED_IN_USER, userInfo);
            this.getUserSubscription = this.authService.getUserById(res['id'], res['userId']).
                subscribe(userDetails => {
                    console.log(userDetails);
                }, error => {
                    this.logService.logError(LOG_LEVELS.ERROR, 'Login page', 'On Fetch User', error);
                });
            this.router.navigate(['../../apps/dashboards/analytics']);
            this.logService.logUserActivity(LOG_LEVELS.INFO, 'Login Page', 'Login');
        }, error => {
            if (error.status === 401) {
                console.log('Invalid Username or Password')
                this.invalidData = false;
            }
            this.logService.logError(LOG_LEVELS.ERROR, 'Login page', 'On Try Login', error);
        });
    }

    unsubscribe(subscription: Subscription) {
        if (subscription !== null && subscription !== undefined) {
            subscription.unsubscribe();
        }
    }

    ngOnDestroy() {
        this.unsubscribe(this.loginSubscription);
        this.unsubscribe(this.getUserSubscription);
        this.loginForm = null;
        this.fuseConfigService = null;
        this.formBuilder = null;
        this.logoPath = null;
        this.authService = null;
        this.router = null;
        this.airmsService = null;
        this.logService = null;
    }
}
