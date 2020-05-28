import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
export interface DialogData {
    animal: string;
    name: string;
  }
  
@Component({
    selector     : 'forgot-password',
    templateUrl  : './forgot-password.component.html',
    styleUrls    : ['./forgot-password.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ForgotPasswordComponent implements OnInit
{
    forgotPasswordForm: FormGroup;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */

    // @ViewChild('filter', {static: true})
    // filter: ElementRef;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;


    constructor(public dialog: MatDialog,
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        public _matDialog: MatDialog,
    )
    {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }
    openwarning(): void {
        const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
          width: '250px',
        //   data: {name: this.name, animal: this.animal}
        });
    
        // dialogRef.afterClosed().subscribe(result => {
        //   console.log('The dialog was closed');
        //   this.animal = result;
        // });
      }
    // deleteContact(): void
    // {
    //     this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
    //         disableClose: false
    //     });
  
    //     this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
  
    //     this.confirmDialogRef.afterClosed().subscribe(result => {
    //         // if ( result )
    //         // {
    //         //     this._contactsService.deleteContact(contact);
    //         // }
    //         this.confirmDialogRef = null;
    //     }
    //     );
  
    // }
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }
}

@Component({
    selector: 'dialog-overview-example-dialog',
    templateUrl: 'dialog-overview-example-dialog.html',
  })
  export class DialogOverviewExampleDialog {
  
    constructor(
      public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
  }
  