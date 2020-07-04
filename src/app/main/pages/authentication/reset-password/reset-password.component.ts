import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { LAYOUT_STRUCTURE, TROY_LOGO, LOG_LEVELS, LOG_MESSAGES  } from 'app/util/constants';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../service/auth.service';
import { LogService } from 'app/service/shared/log.service';
import Swal from 'sweetalert2';
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
    passwordChanged=false;
    hide = true;
    invalidData = true;
    ResetPasswordSubscription: Subscription;
    getUserSubscription: Subscription;
    userName:'';
    errorMessage = '';

    constructor(
        private fuseConfigService: FuseConfigService,
        private authservice: AuthService,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private logService: LogService,
        private router: Router,
    ) {
        this.fuseConfigService.config = LAYOUT_STRUCTURE;
        this.unsubscribeAll = new Subject();
    }
 
    ngOnInit(): void {
        this.resetPasswordForm = this.formBuilder.group({
            password: ['', Validators.required],
            newPassword: ['', [Validators.minLength(8), Validators.maxLength(15)]],
            passwordConfirm: ['', [Validators.required, confirmPasswordValidator]]
        });
        this.resetPasswordForm .get('password').valueChanges;
        this.resetPasswordForm.get('password').valueChanges
            .pipe(takeUntil(this.unsubscribeAll)).subscribe(() => {
                this.resetPasswordForm.get('passwordConfirm').updateValueAndValidity();
            });
         this.route.queryParams.subscribe(params => {
            console.log(params);
            this.userName=params.userName;
           }); 
    }
    resetPassword(value)
    {
        console.log(value);
        this.passwordChanged=false;
        this.logUserActivity('RESET YOUR PASSWORD', LOG_MESSAGES.CLICK);
        this.authservice.resetPassword(value,this.userName).subscribe((res:any) => {
            console.log("response",res.message);
            if (res.message === "your password has been changed") {
                Swal.fire({
                    title: 'Your Password has been Changed',
                    confirmButtonText: 'OK',
                }).then(() => {
                    this.router.navigate (['/pages/login']);
               });
            }
            this.logUserActivity('RESET YOUR PASSWORD', LOG_MESSAGES.SUCCESS);
        },error => {
            if (error.status === 400) {
             this.invalidData = false;
            }
               this.logService.logError(LOG_LEVELS.ERROR, 'Reset_Password_Page', 'on Reset_Password user', JSON.stringify(error));
               this.logUserActivity('RESET YOUR PASSWORD', LOG_MESSAGES.FAILURE);
        });
    } 
    
    
    cancel() {
        this.router.navigate(['']);
        this.logUserActivity('RESET YOUR PASSWORD', LOG_MESSAGES.CANCEL);
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
        // Unsubscribe from all subscriptions
        // this.unsubscribe(this.Subscription);
        this.unsubscribe(this.getUserSubscription);
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
        this.logoPath = null;
        this.userName=null;
        this.route=null;
        this.invalidData=null;
        this.hide=null;
        this.authservice=null;
        this.logService = null;
        this.formBuilder=null;
        this.fuseConfigService=null;
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

    const newPassword = control.parent.get('newPassword');
    const passwordConfirm = control.parent.get('passwordConfirm');

    if (!newPassword || !passwordConfirm) {
        return null;
    }

    if (passwordConfirm.value === '') {
        return null;
    }

    if (newPassword.value === passwordConfirm.value) {
        return null;
    }

    return { passwordsNotMatching: true };
};
