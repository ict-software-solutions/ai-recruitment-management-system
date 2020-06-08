import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { LAYOUT_STRUCTURE, TROY_LOGO } from 'app/util/constants';
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
    signupSubscription: Subscription;
    invalidData = true;

    constructor(
        private fuseConfigService: FuseConfigService,
        private formBuilder: FormBuilder,
        private authservice: AuthService,
        private router: Router,
    ) {
        this.fuseConfigService.config = LAYOUT_STRUCTURE;
    }

    ngOnInit(): void {
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]]
        });
    }

    login(value) {
        this.authservice.login(value).subscribe(Response => {
            this.router.navigate(['../../apps/dashboards/analytics']);
        }, error => {
            if (error.status === 401) {
                this.invalidData = false;
            }
        });
    }

    unsubscribe(subscription: Subscription) {
        if (subscription !== null && subscription !== undefined) {
            subscription.unsubscribe();
        }
    }

    ngOnDestroy() {
        this.unsubscribe(this.signupSubscription);
        this.loginForm = null;
        this.fuseConfigService = null;
        this.formBuilder = null;
        this.logoPath = null;
    }
}
