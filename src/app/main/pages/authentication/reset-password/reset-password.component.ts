import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { LAYOUT_STRUCTURE, TROY_LOGO } from 'app/util/constants';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Subscription } from 'rxjs';
@Component({
    selector: 'reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
    resetPasswordForm: FormGroup;
    logoPath = TROY_LOGO;
    private unsubscribeAll: Subject<any>;
    hide = true;
    ResetPasswordSubscription: Subscription;
    getUserSubscription: Subscription;

    constructor(
        private fuseConfigService: FuseConfigService,
        private formBuilder: FormBuilder
    ) {
        // Configure the layout
        this.fuseConfigService.config = LAYOUT_STRUCTURE;

        // Set the private defaults
        this.unsubscribeAll = new Subject();
    }
 
    ngOnInit(): void {
        this.resetPasswordForm = this.formBuilder.group({
            password: ['', Validators.required],
            passwordNew: ['', [Validators.minLength(8), Validators.maxLength(15)]],
            passwordConfirm: ['', [Validators.required, confirmPasswordValidator]]
        });
        this.resetPasswordForm .get('password').valueChanges;
        this.resetPasswordForm.get('password').valueChanges
            .pipe(takeUntil(this.unsubscribeAll)).subscribe(() => {
                this.resetPasswordForm.get('passwordConfirm').updateValueAndValidity();
            });
    }
    unsubscribe(subscription: Subscription) {
        if (subscription !== null && subscription !== undefined) {
            subscription.unsubscribe();
        }
    }
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        // this.unsubscribe(this.Subscription);
        this.unsubscribe(this.getUserSubscription);
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
        this.logoPath = null;
    }
    cancelEdit()
    {
        close();
    }
}

export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    if (!control.parent || !control) {
        return null;
    }

    const passwordNew = control.parent.get('passwordNew');
    const passwordConfirm = control.parent.get('passwordConfirm');

    if (!passwordNew || !passwordConfirm) {
        return null;
    }

    if (passwordConfirm.value === '') {
        return null;
    }

    if (passwordNew.value === passwordConfirm.value) {
        return null;
    }

    return { passwordsNotMatching: true };
};
