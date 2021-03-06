import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { LoginComponent } from 'app/main/pages/authentication/login/login.component';
import {MatDialogModule} from '@angular/material/dialog';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';

const routes = [
    {
        path: '/login',
        component: LoginComponent
    },
    {
        path: '',
        component: LoginComponent
    }
];

@NgModule({
    declarations: [
        LoginComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        FuseSharedModule,
        ReactiveFormsModule,
        RecaptchaModule, 
        RecaptchaFormsModule,
        MatDialogModule
      
    ],
    entryComponents:[],
    providers: [ ],
    bootstrap: [LoginComponent],
})
export class LoginModule { }
