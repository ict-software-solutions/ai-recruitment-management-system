import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { userDetails } from 'app/models/user-details';
import { LOGGED_IN_USER_INFO } from 'app/util/constants';
import { AirmsService } from 'app/service/airms.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
let $:any;
  
@Component({
    selector: 'forms',
    templateUrl: './forms.component.html',
    styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnInit, OnDestroy {
    lastLogin: string;
    onFileSelected(event) {
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
    showPasswordsection = false;
    check = false;
    userInfo: userDetails;
    confirmDialogs: any;
    contactProfilePic: any;
    $:any;
  
    // show1 = true;

    constructor(public dialog: MatDialog,
        private _formBuilder: FormBuilder,
        private datePipe: DatePipe,
        private airmsService: AirmsService,
   
    ) {
        this.userInfo = airmsService.getSessionStorage(LOGGED_IN_USER_INFO);
        this.lastLogin = datePipe.transform(this.userInfo.lastLogin, 'MMM dd, yyyy hh:mm:ss a');
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
            newPassword: ['', [Validators.minLength(8), Validators.maxLength(15)]],
            check: [''],

        });
        // this.form.controls.email.disable();
        this.form.get('password').valueChanges;
        this.form.get('password').valueChanges
            .pipe(takeUntil(this.unsubscribeAll)).subscribe(() => {
                this.form.get('passwordConfirm').updateValueAndValidity();
            });

    }
    // register(value) {
    //     this.logUserActivity('CREATE AN ACCOUNT', LOG_MESSAGES.CLICK);
    //     this.alreadyExist = false;
    //     this.activationLink = false;
    //     this.errorMessage = '';
    //     this.signupSubscription = this.authservice.signup(value).subscribe(() => {
    //         this.activationLink = true;
    //         this.logUserActivity('CREATE AN ACCOUNT', LOG_MESSAGES.SUCCESS);
    //     }, error => {
    //         if (error.error.message === "email already exists") {
    //             this.errorMessage = 'Email already exists'
    //         }
    //         else if (error.error.message === "userName already exists") {
    //             this.errorMessage = 'User name already exists'
    //         }
    //         this.alreadyExist = true;
    //         this.logService.logError(LOG_LEVELS.ERROR, 'Register_Page', 'on Register user', JSON.stringify(error));
    //         this.logUserActivity('CREATE AN ACCOUNT', LOG_MESSAGES.FAILURE);
    //     });
    // }
    unsubscribe(subscription: Subscription) {
        if (subscription !== null && subscription !== undefined) {
            subscription.unsubscribe();
        }
    }
   
    Edit() {
        console.log(this.enableEdit);
        this.enableEdit = !this.enableEdit;
        console.log(this.enableEdit);
    }

    changePassword(checked) {

        console.log(this.showPasswordsection);
        this.showPasswordsection = !this.showPasswordsection;
        console.log(this.showPasswordsection);
    }
    onValueChange() {
        this.confirmDialogs = true;
      }
      addUser(){
          console.log("form",this.form.value);
      }
    uploadFile(e) {
        const imageDetails = e.target.files[0];
        if (imageDetails.size > 30000 && !imageDetails.type.includes('jpg') && !imageDetails.type.includes('jpeg')) {
          const swalObject = {
            title: '<strong>Invalid Image Found</strong>',
            text: 'Please upload a profile picture, jpg or jpeg, with size less than 30KB.',
          };
          const areYouSure = this.airmsService.swalOKButton(swalObject);
          Swal.fire(areYouSure).then(() => { });
        } else {
          const that = this;
          this.confirmDialogs = true;
          const reader = new FileReader();
          reader.onload = () => {
            that.contactProfilePic = reader.result;
            $('.img-thumbnail').remove();
            $('#photos').append('<div><img  src=' + reader.result + ' id ="img"  class="img-thumbnail img-rounded"></div>');
          };
          reader.readAsDataURL(imageDetails);
          this.form.markAsDirty();
        }
      }
// 


// {
//     this.check=true;
//     this.getUserSubscription = this.authService.getUserById( res['userId']). 
//     subscribe(userDetails => {
//         let user_info = {
                   
//                     "firstName": userDetails.firstName,
//                     "middleName": userDetails.middleName,
//                     "lastName": userDetails.lastName,
//                     "emailAddress": userDetails.email,
//                     "mobileNumber": userDetails.mobile,
//                     "company":userDetails.company ,
//                     "address": userDetails.address,
//                     "city": userDetails.city,
//                     "state": userDetails.state,
//                     "postalCode":userDetails.postalCode,
//                     'check':userDetails.check,
//                     "password": userDetails.password,
//                     "newPassword": userDetails.newPassword
//                 }
              
               
//     });

// }
      
    getClipboardContent() {
        return window.navigator['clipboard'].readText();
    }
    ngOnDestroy(): void {
        this.unsubscribe(this.getUserSubscription);
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
        this.contactProfilePic = null;
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
