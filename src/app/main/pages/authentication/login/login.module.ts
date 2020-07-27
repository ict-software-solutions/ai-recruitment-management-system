import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { AppMaterialModule } from 'app/app-material/app-material.module';
import { LoginComponent } from 'app/main/pages/authentication/login/login.component';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';

const routes = [
    {
        path: '/login', component: LoginComponent
    },
    {
        path: '', component: LoginComponent
    }
];

@NgModule({
    declarations: [
        LoginComponent
    ],
    imports: [
        FuseSharedModule,
        ReactiveFormsModule,
        RecaptchaModule,
        RecaptchaFormsModule,
        AppMaterialModule,
        RouterModule.forChild(routes),
    ],
    bootstrap: [LoginComponent],
})
export class LoginModule { }
