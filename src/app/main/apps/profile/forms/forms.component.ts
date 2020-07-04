import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { userDetails } from 'app/models/user-details';
import { LOGGED_IN_USER_INFO, SIGNUP } from 'app/util/constants';
import { AirmsService } from 'app/service/airms.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { UserService } from 'app/service/user.service';
import { userInfo } from 'os';
import { AuthService } from 'app/service/auth.service';

// import { UserService } from './user.service';
let $: any;
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
    user: userDetails;
    confirmDialogs: any;
    contactProfilePic: any;
    $: any;
    userProfileUpdateSubscription: Subscription;
    isLoading: false;
    profileDetails: any;


    constructor(private userService: UserService,
        public dialog: MatDialog,
        private _formBuilder: FormBuilder,
        private datePipe: DatePipe,
        private airmsService: AirmsService,
        private authService: AuthService,

    ) {
        this.userInfo = airmsService.getSessionStorage(LOGGED_IN_USER_INFO);
        this.user = airmsService.getSessionStorage(SIGNUP)
        console.log("LOGGED_IN_USER_INFO", this.userInfo);
        this.lastLogin = datePipe.transform(this.userInfo.lastLogin, 'MMM dd, yyyy hh:mm:ss a');
        this.unsubscribeAll = new Subject();
        this.userProfileUpdateSubscription = this.userService.userProfileUpdated$.subscribe(res => {
            console.log("res", this.user);
            if (res !== null) {
                this.form.patchValue(res);
            }
        });
    }

    ngOnInit() {
        this.form = this._formBuilder.group({
            userId: ['', Validators.required],
            firstName: ['', Validators.required],
            middleName: ['', Validators.required],
            lastName: ['', Validators.required],
            emailAddress: ['', Validators.required],
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
        this.getProfileInfo();
    }

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

    getProfileInfo() {
        console.log("user", this.user);
        this.authService.getProfileInfo(this.user).subscribe(res => {
            this.profileDetails = res
            this.form.patchValue(res);
            console.log("response", res);
        })

    }

    canceledit(){
        console.log("user", this.user);
        this.authService.getProfileInfo(this.user).subscribe(res => {
            this.profileDetails = res
            this.form.patchValue(res);
            console.log("cancel edit", res);
        })
    }
    updateProfile(value) {
        console.log("updated profile", value);
        let updateObject = {
            "firstName": value.firstName,
            "middleName": value.middleName,
            "lastName": value.lastName,
            "emailAddress": value.emailAddress,
            "mobileNumber": value.mobile,
            "company": value.companyname,
            "address": value.address,
            "city": value.city,
            "state": value.state,
            "postalCode": value.postalCode,
            // "password": value.password,
            // "newPassword": value.newPassword
        }


        if (value.check === true) {
            updateObject['password'] = value.password;
            updateObject['newPassword'] = value.newPassword;
        }
        this.authService.updateProfileDetails(updateObject, this.user).subscribe(res => {
            // this.updateProfile = res
            console.log("updateObject", res);
            // this.form.patchValue(res);
        })
    }
    changePassword(checked) {

        console.log(this.showPasswordsection);
        this.showPasswordsection = !this.showPasswordsection;
        console.log(this.showPasswordsection);
    }
    onValueChange() {
        this.confirmDialogs = true;
    }
    // addUser() {
    //     console.log("form", this.form.value);
    // }
    uploadFile(e) {
        const imageDetails = e.target.files[0];
        if (imageDetails.size > 30000 && !imageDetails.type.includes('jpg') && !imageDetails.type.includes('jpeg')) {
            const swalObject = {
                title: '<strong>Invalid Image Found</strong>',
                text: 'Please upload a profile picture, jpg or jpeg, with size less than 8MB.',
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
