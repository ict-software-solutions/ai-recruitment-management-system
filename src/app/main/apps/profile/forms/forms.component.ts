import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subscription } from 'rxjs';
@Component({
    selector: 'forms',
    templateUrl: './forms.component.html',
    styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnInit, OnDestroy {
    onFileSelected(event){
console.log(event);
    }
    form: FormGroup;
    dialogRef: any;
    showPassword = true;
    inboundClick = false;
    ResetPasswordSubscription: Subscription;
    getUserSubscription: Subscription;
    hide = true;
    private unsubscribeAll: Subject<any>;
    enableEdit = false;
    showPasswordsection=false;
    // show1 = true;

    constructor(public dialog: MatDialog,
        private _formBuilder: FormBuilder
    ) {
        this.unsubscribeAll = new Subject();
    }

    ngOnInit() {
        this.form = this._formBuilder.group({
            firstName: ['', Validators.required],
            secondName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', Validators.required],
            mobile: ['', Validators.required],
            companyname: ['', Validators.required],
            position: ['', Validators.required],
            address: ['', Validators.required],
            postalcode: ['', Validators.required],
            city: ['', Validators.required],
            state: ['', Validators.required],
            country: ['', Validators.required],
            password: ['', Validators.required],
            NewPassword: ['', [Validators.minLength(8), Validators.maxLength(15)]],
            check: [''],

        });
        // this.form.controls.email.disable();
        this.form.get('password').valueChanges;
        this.form.get('password').valueChanges
            .pipe(takeUntil(this.unsubscribeAll)).subscribe(() => {
                this.form.get('passwordConfirm').updateValueAndValidity();
            });
         
    }
    unsubscribe(subscription: Subscription) {
        if (subscription !== null && subscription !== undefined) {
            subscription.unsubscribe();
        }
    }
    ngOnDestroy(): void {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }
    Edit(){
        console.log(this.enableEdit);
        this.enableEdit = !this.enableEdit;
        console.log(this.enableEdit); 
    }
 
    changePassword(checked) {
      
        console.log(this.showPasswordsection);
        this.showPasswordsection = !this.showPasswordsection;
        console.log(this.showPasswordsection);
  }
    
    getClipboardContent() {
        return window.navigator['clipboard'].readText();
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
