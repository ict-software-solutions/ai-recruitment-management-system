import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { LAYOUT_STRUCTURE, TROY_LOGO } from 'app/util/constants';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { AuthService } from '../../../../service/auth.service';

@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class RegisterComponent implements OnInit, OnDestroy {
    registerForm: FormGroup;
    private _unsubscribeAll: Subject<any>;
    logoPath = TROY_LOGO;
    Authentication;
    signupSubscription: Subscription;

    constructor(
        private fuseConfigService: FuseConfigService,
        private formBuilder: FormBuilder,
        private router: Router,
        private authservice: AuthService,
    ) {
        this.fuseConfigService.config = LAYOUT_STRUCTURE;
        this._unsubscribeAll = new Subject();
    }

    ngOnInit() {
        this.registerForm = this.buildRegisterForm();
        this.registerForm.get('password').valueChanges
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
                this.registerForm.get('passwordConfirm').updateValueAndValidity();
            });
    }

    buildRegisterForm() {
        return this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.minLength(6), Validators.maxLength(15)]],
            passwordConfirm: ['', [Validators.required, confirmPasswordValidator]],
            check: ['', Validators.required]
        });
    }

    register(value) {
        this.signupSubscription = this.authservice.signup(value).subscribe(response => {
            console.log(response);
            this.router.navigate(['/pages/auth/login']);
        });
        console.log(value);
    }

    cancel() {
        this.router.navigate(['']);
    }

    unsubscribe(subscription: Subscription) {
        if (subscription !== null && subscription !== undefined) {
            subscription.unsubscribe();
        }
    }

    ngOnDestroy(): void {
        this.unsubscribe(this.signupSubscription);
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this.registerForm = null;
        this.fuseConfigService = null;
        this.formBuilder = null;
        this.logoPath = null;
    }
}
/**
 * Confirm password validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */

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

