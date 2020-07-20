import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {MatRadioModule} from '@angular/material/radio';
import { Subject } from 'rxjs';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { userDetails } from 'app/models/user-details';
import { LOGGED_IN_USER_INFO, SIGNUP } from 'app/util/constants';
import { AirmsService } from 'app/service/airms.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { usertype } from 'app/models/user-type';
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from 'app/service/user.service';
import { userInfo } from 'os';
import { AuthService } from 'app/service/auth.service';


let $: any;
@Component({
    selector: 'forms',
    templateUrl: './forms.component.html',
    styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnInit, OnDestroy {
    lastLogin: string;
    onFileSelected(event) {
        // console.log(event);
    }
    form: FormGroup;
    dialogRef: any;
    showPassword = true;
    inboundClick = false;
    ResetPasswordSubscription: Subscription;
    getUserSubscription: Subscription;
    hide = true;
    hide1 = true;
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
    viewMode = true;
    userName: "";
    labelPosition: 'before' | 'after' = 'after';
    errorMessage = '';
    oldPasswordWrong = false;
    getUserById: boolean;
    status:"";
   

    usertype: usertype[] = [
        { value: 'employee-0', viewValue: 'Employee' },
        { value: 'client-1', viewValue: 'Client' },
        { value: 'candidate-2', viewValue: 'Candidate' }
    ];
    userrole = ['Admin', 'Manager', 'Candidate Consultant', 'Client Consultant', 'Candidate View', 'client', 'customer'];


    constructor(private userService: UserService,
        public dialog: MatDialog,
        public radio : MatRadioModule,
        private _formBuilder: FormBuilder,
        private datePipe: DatePipe,
        private route: ActivatedRoute,
        private router: Router,
        private airmsService: AirmsService,
        private authService: AuthService,

    ) {
        
        this.userInfo = airmsService.getSessionStorage(LOGGED_IN_USER_INFO);
        this.user = airmsService.getSessionStorage(SIGNUP)
        this.lastLogin = datePipe.transform(this.userInfo.lastLogin, 'MMM dd, yyyy hh:mm:ss a');
        this.unsubscribeAll = new Subject();
        this.userProfileUpdateSubscription = this.userService.userProfileUpdated$.subscribe(res => {

            if (res !== null) {
                this.form.patchValue(res);
            }
        });
    }

    ngOnInit() {
        this.form = this._formBuilder.group({
            userId: ['', Validators.required],
            firstName: [''],
            middleName: [''],
            lastName: [''],
            emailAddress: [''],
            mobile: [''],
            companyname: [''],
            position: [''],
            address: [''],
            postalcode: [''],
            city: [''],
            state: [''],
            country: [''],
            password: ['', Validators.required],
            newPassword: ['', [Validators.minLength(8), Validators.maxLength(15)]],
            check: [''],
        });

        this.route.queryParams.subscribe(params => {
          this.userName = params["userName"];
          console.log(params);
          if (params.userName==='Nic') {
              this.getUserById = false;
          }
          else{
              this.getUserById=true;
          }

        });
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
        this.viewMode = false;
        this.enableEdit = !this.enableEdit;
    }

    getProfileInfo() {
        this.authService.getProfileInfo(this.user).subscribe(res => {
            this.profileDetails = res
            this.form.patchValue(res);
        })
    }

    canceledit() {
        this.viewMode = true;

        this.authService.getProfileInfo(this.user).subscribe(res => {
            this.profileDetails = res
            this.form.patchValue(res);
        })
    }
    updateProfile(value) {
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
            'userId': this.user.userId
        }
        if (value.check === true) {
            if (value.password != value.newPassword) {
                updateObject['password'] = value.password;
                updateObject['newPassword'] = value.newPassword;
            } else {
                Swal.fire({
                    title: 'New password cannot be the same as Old Password',
                    icon: 'warning',
                    confirmButtonText: 'Ok',
                })
                return;
            }
        }
        this.authService.updateProfileDetails(updateObject, this.user).subscribe(res => {
            Swal.fire({
                title: 'Profile Updated',
                icon: 'success',
                confirmButtonText: 'Ok',
            }).then(res => {
                if (res.value === true) {
                    this.canceledit()
                    this.enableEdit = false;
                }
            })
        }
            , error => {
                if (error.error.message === 'old password does not match') {
                    this.errorMessage = error.error.message;
                    this.oldPasswordWrong = true;
                    Swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: 'Current password is wrong',
                        showConfirmButton: true,
                    })
                }
            });
    }
    changePassword(checked) {
        this.showPasswordsection = !this.showPasswordsection;
    }
    onValueChange() {
        this.confirmDialogs = true;
    }
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
        this.getUserById=null;
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
