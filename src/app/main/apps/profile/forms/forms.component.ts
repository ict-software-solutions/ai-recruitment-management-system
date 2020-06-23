import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
// import { ResetPasswordComponent } from '../../pages/authentication/reset-password/reset-password.component';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'forms',
    templateUrl: './forms.component.html',
    styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnInit, OnDestroy {
    form: FormGroup;
    dialogRef: any;
    showPassword = true;
    inboundClick = false;
    // isDisplay = true;
    hide = true;
    private unsubscribeAll: Subject<any>;
    show1 = false;
    // show: boolean = true;

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
            passwordNew: ['', [Validators.minLength(8), Validators.maxLength(15)]],
            check: [''],

        });
        this.form.get('password').valueChanges;
        this.form.get('password').valueChanges
            .pipe(takeUntil(this.unsubscribeAll)).subscribe(() => {
                this.form.get('passwordConfirm').updateValueAndValidity();
            });
    }
    // onUpload() {
    //     const imageDetails = target.files[0];
    //     if (imageDetails.size > 30000 && !imageDetails.type.includes('jpg') && !imageDetails.type.includes('jpeg')) {
    //       const swalObject = {
    //         title: '<strong>Invalid Image Found</strong>',
    //         text: 'Please upload a profile picture, jpg or jpeg, with size less than 30KB.',
    //       };
    //       const areYouSure = this.ngaugeService.swalOKButton(swalObject);
    //       Swal(areYouSure).then(() => { });
    //     } else {
    //       const that = this;
    //       this.confirmDialogs = true;
    //       const reader = new FileReader();
    //       reader.onload = () => {
    //         that.contactProfilePic = reader.result;
    //         $('.img-thumbnail').remove();
    //         $('#photos').append('<div><img  src=' + reader.result + ' id ="img"  class="img-thumbnail img-rounded"></div>');
    //       };
    //       reader.readAsDataURL(imageDetails);
    //       this.form.markAsDirty();
    //     }
    //   }
    ngOnDestroy(): void {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }
    // toggleDisplay() {
    //     this.isDisplay = !this.isDisplay;
    // }
    changePassword(checked) {
        // alert(this.show1);
        console.log(this.show1);
        this.show1 = !this.show1;
        // alert(this.show1);
        console.log(this.show1);
  }
    // openDialog(): void {
    //     const dialogRef = this.dialog.open(ResetPasswordComponent, {
    //         height: '550px'

    //     });
    // }
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
