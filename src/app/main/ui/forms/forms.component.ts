import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

// import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
// import { UploadComponent } from '../upload/upload.component';
// import { UploadComponent } from './upload/upload.component';
// export interface DialogData {
//     animal: string;
//     name: string;
//   }
@Component({
    selector: 'forms',
    templateUrl: './forms.component.html',
    styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnInit, OnDestroy {
    form: FormGroup;
    dialogRef: any;

    // Horizontal Stepper
    horizontalStepperStep1: FormGroup;
    horizontalStepperStep2: FormGroup;
    horizontalStepperStep3: FormGroup;
    horizontalStepperStep4: FormGroup;
    horizontalStepperStep5: FormGroup;
    horizontalStepperStep6: FormGroup;

    // Vertical Stepper
    // verticalStepperStep1: FormGroup;
    // verticalStepperStep2: FormGroup;
    // verticalStepperStep3: FormGroup;

    // Private
    // private _unsubscribeAll: Subject<any>;
    // name: any;
    // animal: any;

    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _formBuilder: FormBuilder
    ) {
        // Set the private defaults
        // this._unsubscribeAll = new Subject();
    }
    // upload(): void
    // {
    //     // alert("hi");
    //     this.dialogRef = this.dialog.open(UploadComponent, {
    //         panelClass: 'mail-compose-dialog'
    //     });
    //     this.dialogRef.afterClosed()
    //         // .subscribe(response => {
    //         //     if ( !response )
    //         //     {
    //         //         return;
    //         //     }
    //         //     const actionType: string = response[0];
    //         //     const formData: FormGroup = response[1];
    //         //     switch ( actionType )
    //         //     {
    //         //         /**
    //         //          * Send
    //         //          */
    //         //         case 'send':
    //         //             console.log('new Mail', formData.getRawValue());
    //         //             break;
    //         //         /**
    //         //          * Delete
    //         //          */
    //         //         case 'delete':
    //         //             console.log('delete Mail');
    //         //             break;
    //         //     }
    //         // }
    //         // );
    // }

    // openDialog(): void {
    //     const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
    //       width: '400px',
    //       data: {name: this.name, animal: this.animal}
    //     });

    //     dialogRef.afterClosed().subscribe(result => {
    //       console.log('The dialog was closed');
    //       this.animal = result;
    //     });
    //   }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

    }
    // {
    //     // Reactive Form
    //     this.form = this._formBuilder.group({
    //         company   : [
    //             {
    //                 value   : 'Google',
    //                 disabled: true
    //             }, Validators.required
    //         ],
    //         firstName : ['', Validators.required],
    //         lastName  : ['', Validators.required],
    //         edu_qual  : ['', Validators.required],
    //         grade : ['', Validators.required],
    //         yop  : ['', Validators.required],
    //         address   : ['', Validators.required],
    //         address2  : ['', Validators.required],
    //         city      : ['', Validators.required],
    //         state     : ['', Validators.required],
    //         postalCode: ['', [Validators.required, Validators.maxLength(5)]],
    //         country   : ['', Validators.required],
    //         job   : ['', Validators.required],
    //         domain   : ['', Validators.required],
    //         // exp   : ['', Validators.required],
    //         comp   : ['', Validators.required],
    //         dob   : ['', Validators.required],
    //         sex: ['', Validators.required],
    //         major: ['', Validators.required],
    //         cgpa: ['', Validators.required],
    //         year: ['', Validators.required],
    //         from: ['', Validators.required],
    //         to: ['', Validators.required],
    //         month: ['', Validators.required],
    //         school: ['', Validators.required],
    //         sch_grade: ['', Validators.required],
    //         sec_from: ['', Validators.required],
    //         sec_to: ['', Validators.required],
    //         exp_from: ['', Validators.required],
    //         exp_to: ['', Validators.required],
    //         skill: ['', Validators.required],
    //         exp_from2: ['', Validators.required],
    //         exp_to2: ['', Validators.required],
    //         skill2: ['', Validators.required],
    //         job2   : ['', Validators.required],
    //         domain2   : ['', Validators.required],
    //         // exp   : ['', Validators.required],
    //         comp2   : ['', Validators.required],
    //         mob_num   : ['', Validators.required],
    //         mob_num2   : ['', Validators.required],
    //         email  : ['', Validators.required],
    //         marital  : ['', Validators.required]
    //     });

    //     // Horizontal Stepper form steps
    //     // this.horizontalStepperStep1 = this._formBuilder.group({
    //         // firstName: ['', Validators.required],
    //         // lastName : ['', Validators.required],
    //         // dob : ['', Validators.required],
    //         // sex : ['', Validators.required],

    // }

    //     });

    //     this.horizontalStepperStep2 = this._formBuilder.group({
    //         address: ['', Validators.required]
    //     });

    //     this.horizontalStepperStep3 = this._formBuilder.group({
    //         // country     : ['', Validators.required],
    //         // city      : ['', Validators.required],
    //         // state     : ['', Validators.required],
    //         // postalCode: ['', [Validators.required, Validators.maxLength(5)]]

    //     });
    //     this.horizontalStepperStep4 = this._formBuilder.group({
    //         // edu_qual  : ['', Validators.required],
    //         // major: ['', Validators.required],
    //         // grade : ['', Validators.required],
    //         // cgpa: ['', Validators.required],
    //         // yop  : ['', Validators.required]
    //         // yop  : ['', Validators.required],
    //     });
    //     this.horizontalStepperStep5 = this._formBuilder.group({
    //         // job  : ['', Validators.required],
    //         // domain : ['', Validators.required],
    //         // exp  : ['', Validators.required],
    //         // year  : ['', Validators.required],
    //         // comp  : ['', Validators.required],
    //         // month : ['', Validators.required]
    //     });
    //     // Vertical Stepper form stepper
    //     // this.verticalStepperStep1 = this._formBuilder.group({
    //     //     firstName: ['', Validators.required],
    //     //     lastName : ['', Validators.required]
    //     // });

    //     // this.verticalStepperStep2 = this._formBuilder.group({
    //     //     address: ['', Validators.required]
    //     // });

    //     // this.verticalStepperStep3 = this._formBuilder.group({
    //     //     city      : ['', Validators.required],
    //     //     state     : ['', Validators.required],
    //     //     postalCode: ['', [Validators.required, Validators.maxLength(5)]]
    //     // });
    // }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        // this._unsubscribeAll.next();
        // this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Finish the horizontal stepper
     */
    finishHorizontalStepper(): void {
        alert('You have finished the horizontal stepper!');
    }

    /**
     * Finish the vertical stepper
     */
    // finishVerticalStepper(): void
    // {
    //     alert('You have finished the vertical stepper!');
    // }
}
// @Component({
//     selector: 'dialog-overview-example-dialog',
//     templateUrl: 'dialog-overview-example-dialog.html',
//     styleUrls  : ['dialog.scss']
//   })
//   export class DialogOverviewExampleDialog {

//     constructor(
//       public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
//       @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

//     onNoClick(): void {
//       this.dialogRef.close();
//     }

//   }
