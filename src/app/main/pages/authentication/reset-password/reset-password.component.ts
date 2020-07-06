import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, FormControl } from '@angular/forms';
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
    hide1 = true;
    invalidData = true;
    ResetPasswordSubscription: Subscription;
    getUserSubscription: Subscription;
    userName:'';
    token:'';
    errorMessage = '';
    type: any;
    email: any;
    check = false;
    changePassword: boolean;

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
            newPassword: ['', [Validators.minLength(8), Validators.maxLength(15)]]
        });
         this.route.queryParams.subscribe(params => {
             console.log(params);
             if (params.userName) {
                 this.resetPasswordForm.addControl('password', new FormControl('', Validators.required));
                 this.userName = params.userName;
                 this.changePassword = false;
                 
        this.resetPasswordForm .get('password').valueChanges;
        this.resetPasswordForm.get('password').valueChanges
            .pipe(takeUntil(this.unsubscribeAll)).subscribe(() => {
                this.resetPasswordForm.get('passwordNew').updateValueAndValidity();
            });
             } else {
                 this.type = params.type;
                 this.email = params.email;
                 this.token = params.token;
                 this.changePassword = true
             }
           }); 
    }
    resetPassword(value)    {
        console.log(value);
        this.passwordChanged=false;
        this.logUserActivity('RESET YOUR PASSWORD', LOG_MESSAGES.CLICK);

    let param: any;
        if (!this.changePassword) {
           param= {
                userName: this.userName,
                password: value.password,
                    newPassword: value.newPassword,
                    chnagePassword: false
            }
        } else {
            param = {
                newPassword: value.newPassword,
                emailAddress :this.email ,
                token :this.token,
                changePassword:true

            }
        }
    //    let  updateObject= {
    //     "password": value.password,
    //     "newPassword": value.newPassword,
    //    }
    //    if (value.check === true) {
    //     if(value.password!= value.newPassword){
    //     updateObject['password'] = value.password;
    //     updateObject['newPassword'] = value.newPassword;
    //    }else{
    //     Swal.fire({
    //         title: 'New password cannot be the same as Old Password',
    //         icon:'warning',
    //        confirmButtonText: 'Ok',
    //     })
        
    // }
    // }
        this.authservice.resetPassword(param).subscribe((res:any) => {
            console.log("response",res.message);
            if (res.resCode === "PWD-CNGD") {
                this.passwordResetDone();
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
    // if (value.check === true) {
    //     if(value.password!= value.newPassword){
    //     param['password'] = value.password;
    //     param['newPassword'] = value.newPassword;
    // }else{
    //     Swal.fire({
    //         title: 'New password cannot be the same as Old Password',
    //         icon:'warning',
    //        confirmButtonText: 'Ok',
    //     })         
    // }
    passwordResetDone() {
                Swal.fire({
               
                    text: 'Your Password has been Changed',
                    icon:'success',
                    position: 'center',
                    confirmButtonText: 'OK',
                }).then(() => {
                    this.router.navigate (['/pages/login']);
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
        this.unsubscribe(this.getUserSubscription);
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
        this.logoPath = null;
        this.userName=null;
        this.route=null;
        this.invalidData=null;
        this.hide=null;
        this.hide1=null;
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

export const newPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    if (!control.parent || !control) {
        return null;
    }

    const password = control.parent.get('password');
    const newPassword = control.parent.get('newPassword');
  
    if (password || newPassword) {
        return null;
    }

    if (newPassword.value === '') {
        return null;
    }

    if (password.value! === newPassword.value) {
        return null;
    }

    return { passwordsNotMatching: true };
};
