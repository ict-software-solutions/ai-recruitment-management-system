import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { LAYOUT_STRUCTURE, TROY_LOGO, EMAIL_PATTERN, LOG_LEVELS, LOG_MESSAGES } from 'app/util/constants';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { AuthService } from '../../../../service/auth.service';
import { LogService } from 'app/service/shared/log.service';
import Swal from 'sweetalert2';
@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class RegisterComponent implements OnInit, OnDestroy {
    accounts = ['Client', 'Candidate'];
    registerForm: FormGroup;
    private unsubscribeAll: Subject<any>;
    logoPath = TROY_LOGO;
    alreadyExist = false;
    errorMessage = '';
    activationLink = false;
    signupSubscription: Subscription;
    hide = true;

    constructor(
        private fuseConfigService: FuseConfigService,
        private formBuilder: FormBuilder,
        private router: Router,
        private authservice: AuthService,
        private logService: LogService
    ) {
        this.fuseConfigService.config = LAYOUT_STRUCTURE;
        this.unsubscribeAll = new Subject();
    }

    ngOnInit() {
        this.registerForm = this.buildRegisterForm();
        this.registerForm.get('password').valueChanges
            .pipe(takeUntil(this.unsubscribeAll)).subscribe(() => {
                this.registerForm.get('passwordConfirm').updateValueAndValidity();
            });
    }

    buildRegisterForm() {
        return this.formBuilder.group({
            userType: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            emailAddress: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
            userName: ['', [Validators.minLength(6), Validators.maxLength(30)]],
            password: ['', [Validators.minLength(8), Validators.maxLength(15)]],
            // passwordConfirm: ['', [Validators.required, confirmPasswordValidator]],
            check: ['', Validators.required]
        });
    }

    register(value) {
        this.logUserActivity('CREATE AN ACCOUNT', LOG_MESSAGES.CLICK);
        this.signupSubscription = this.authservice.signup(value).subscribe(() => {
            this.activationLink = true;
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Account activation link send your email id',
                showConfirmButton: true,
            });

            this.logUserActivity('CREATE AN ACCOUNT', LOG_MESSAGES.SUCCESS);
        }, error => {
            if (error.error.message === "email already exists") {
                this.errorMessage = 'Email already in use'
            }
            else if (error.error.message === "userName already exists") {
                this.errorMessage = 'User name already exists'
            }
            this.alreadyExist = true;
            this.logService.logError(LOG_LEVELS.ERROR, 'Register_Page', 'on Register user', JSON.stringify(error));
            this.logUserActivity('CREATE AN ACCOUNT', LOG_MESSAGES.FAILURE);
        });
    }

    cancel() {
        this.router.navigate(['']);
        this.logUserActivity('CREATE AN ACCOUNT', LOG_MESSAGES.CANCEL);
    }

    logUserActivity(from, value) {
        this.logService.logUserActivity(LOG_LEVELS.INFO, from, value);
    }

    unsubscribe(subscription: Subscription) {
        if (subscription !== null && subscription !== undefined) {
            subscription.unsubscribe();
        }
    }

    ngOnDestroy(): void {
        this.unsubscribe(this.signupSubscription);
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
        this.registerForm = null;
        this.fuseConfigService = null;
        this.formBuilder = null;
        this.logoPath = null;
        this.activationLink = null;
        this.errorMessage = null;
        this.alreadyExist = null;
        this.router = null;
        this.authservice = null;
        this.logService = null;
        this.accounts = null;
    }
}

export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (!control.parent || !control) {
        return null;
    }
    const password = control.parent.get('password');
    const passwordConfirm = control.parent.get('passwordConfirm');
    if (!password || !passwordConfirm) {
        return null;
    }
    if (passwordConfirm.value === '') {
        return null;
    }
    if (password.value === passwordConfirm.value) {

        return null;
    }
    return { passwordsNotMatching: true };
};