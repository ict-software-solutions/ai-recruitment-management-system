import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseConfigService } from '@fuse/services/config.service';
import { TROY_LOGO, LAYOUT_STRUCTURE } from 'app/util/constants';

export interface DialogData {
    animal: string;
    name: string;
}

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
    ) {
        // Configure the layout
        this._fuseConfigService.config = LAYOUT_STRUCTURE;
    }

    openwarning(): void {
        this.dialog.open(DialogOverviewExampleDialog, {
            width: '250px',
        });
    }

    ngOnInit(): void {
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
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
