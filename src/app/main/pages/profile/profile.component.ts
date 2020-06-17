import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ResetPasswordComponent } from '../authentication/reset-password/reset-password.component';
// import { ResetPasswordComponent } from 'app/layout/components/toolbar/toolbar.component';
export interface PeriodicElement {
  name: string;
  birthday: string;
  mobile: string;
  email: string;
  gender: string;
  company: string;
  lastLogin: string;
}

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})

export class ProfileComponent {
  name = "Hellen Adams";
  email = "hellon@gmail.com";
  mobile = "7989 039789";
  birthday = "2nd june 1993";
  gender = "female";
  company = "Atlas Software Sollutions";
  lastLogin = "16th june 2020"
  constructor(public dialog: MatDialog) {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ResetPasswordComponent, {
      width: '480px',
      height: '550px'

    });
  }
}
