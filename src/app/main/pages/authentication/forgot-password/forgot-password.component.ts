import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseConfigService } from '@fuse/services/config.service';
import { TROY_LOGO, LAYOUT_STRUCTURE, EMAIL_PATTERN} from 'app/util/constants';
import { AuthService } from 'app/service/auth.service';

@Component({
    selector: 'forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class ForgotPasswordComponent implements OnInit, OnDestroy {

    forgotPasswordForm: FormGroup;
    logoPath = TROY_LOGO;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(
        public dialog: MatDialog,
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        public _matDialog: MatDialog,
        private authService:AuthService,
    ) {
        // Configure the layout
        this._fuseConfigService.config = LAYOUT_STRUCTURE;
    }



    ngOnInit(): void {
        this.forgotPasswordForm = this._formBuilder.group({
            emailAddress: ['', [Validators.required,  Validators.pattern(EMAIL_PATTERN)]]
        });
    }
    sendResetLink(){
        this.authService.sendResetLink(this.forgotPasswordForm.value.emailAddress).subscribe((res:any)=>{
            console.log("response",res);
        })
    }

    

    



    // resend() {
    //     console.log(this.loginForm.value.userName)
    //     this.errorMessage = '';
    //     this.authService.resendActivationMail(this.loginForm.value.userName).subscribe((res: any) => {
    //         console.log("response", res.message);
    //         if (res.message === "activation link send successfully") {
    //             Swal.fire('Activation link send your email-Id')
    //         }


    //     })
    // }
    ngOnDestroy() {
        this.dialog = null;
        this._fuseConfigService = null;
        this._formBuilder = null;
        this._matDialog = null;
        this.forgotPasswordForm = null;
        this.logoPath = null;
    }
}


