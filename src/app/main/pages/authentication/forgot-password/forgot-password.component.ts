import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseConfigService } from '@fuse/services/config.service';
import { TROY_LOGO, LAYOUT_STRUCTURE, EMAIL_PATTERN } from 'app/util/constants';
import { AuthService } from 'app/service/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
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
    errorMessage = '';
    wrongEmail = false;
    constructor(
        public dialog: MatDialog,
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        public _matDialog: MatDialog,
        private router: Router,
        private authService: AuthService,
    ) {
        this._fuseConfigService.config = LAYOUT_STRUCTURE;
    }
    ngOnInit(): void {
        this.forgotPasswordForm = this._formBuilder.group({
            emailAddress: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]]
        });
    }

    sendResetLink(){
        
        this.authService.sendResetLink(this.forgotPasswordForm.value.emailAddress).subscribe((res:any)=>{
            if (res.resCode === "CNG-PWD-LNK-SEND") {
                this.sendLink();
            }
        }, error => {
            if (error.error.message === 'email/userName not registered' || error.error.message === "Account Inactive") {
                this.errorMessage = error.error.message;
                this.wrongEmail = true;
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Incorrect Email address. Please enter a valid Email address',
                    showConfirmButton: true,
                })
            }
        });
    }

    sendLink() {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Reset Password link sent to your mail suceessfully',
            confirmButtonText: 'OK',
        });
    }

    ngOnDestroy() {
        this.dialog = null;
        this._fuseConfigService = null;
        this._formBuilder = null;
        this._matDialog = null;
        this.forgotPasswordForm = null;
        this.logoPath = null;
    }
}


