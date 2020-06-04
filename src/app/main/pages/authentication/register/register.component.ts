import { Component, OnDestroy, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { TROY_LOGO, LAYOUT_STRUCTURE } from 'app/util/constants';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../../../service/auth.service';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
export interface DialogData {
    sample: string;
    name: string;
}

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
    constructor(
        public dialog: MatDialog,
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private router: Router,
        private authservice:AuthService,
        public _matDialog: MatDialog,
    ) 
    
    
    {
        // Configure the layout
        this._fuseConfigService.config = LAYOUT_STRUCTURE;
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    opensuccess(): void {
        this.dialog.open(DialogOverviewExampleDialog, {
            width: '250px',
        });
    }


    ngOnInit() {
        this.registerForm = this.buildRegisterForm(); // build form
        // Triggers on password change, used to compare passsword
        this.registerForm.get('password').valueChanges
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
                this.registerForm.get('passwordConfirm').updateValueAndValidity();

        
            });
    }

    buildRegisterForm() {
        return this._formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.minLength(6), Validators.maxLength(15)]],
            passwordConfirm: ['', [Validators.required, confirmPasswordValidator]],
            check: ['', Validators.required]
        });
       
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this.registerForm = null;
        this._fuseConfigService = null;
        this._formBuilder = null;
        this.logoPath = null;
      
    }

    register(value) {
    this.authservice.signup(value).subscribe(response => {
        console.log(response);
        this.router.navigate(['/pages/auth/login']);
    });

        console.log(value);
    }

    cancel() {
        this.router.navigate(['']);
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
@Component({
    selector: 'dialog-overview-example-dialog',
    templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {

    constructor(
        public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
