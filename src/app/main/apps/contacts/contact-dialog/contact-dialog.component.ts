import {  OnInit } from '@angular/core';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MailComposeDialogComponent } from 'app/main/apps/mail/dialogs/compose/compose.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-contact-dialog',
  templateUrl: './contact-dialog.component.html',
  styleUrls: ['./contact-dialog.component.scss']
})
export class ContactDialogComponent implements OnInit {
    dialogRef: any;
  /**
     * Constructor
     *
     * @param {MatDialogRef<ContactDialogComponent>} matDialogRef
     * @param _data
     * @param {MatDialog} _matDialog
     */
    constructor(
      public matDialogRef: MatDialogRef<ContactDialogComponent>,
      @Inject(MAT_DIALOG_DATA) private _data: any,
      public _matDialog: MatDialog
  )
  {
      // Set the defaults
      // this.composeForm = this.createComposeForm();
      // this.showExtraToFields = false;
  }

  composeDialog(): void
    {
        this.dialogRef = this._matDialog.open(MailComposeDialogComponent, {
            panelClass: 'mail-compose-dialog'
        });
        this.dialogRef.afterClosed()
            .subscribe(response => {
                if ( !response )
                {
                    return;
                }
                const actionType: string = response[0];
                const formData: FormGroup = response[1];
                switch ( actionType )
                {
                    /**
                     * Send
                     */
                    case 'send':
                        console.log('new Mail', formData.getRawValue());
                        break;
                    /**
                     * Delete
                     */
                    case 'delete':
                        console.log('delete Mail');
                        break;
                }
            }
            );
    }

  ngOnInit(): void {
  }

}
