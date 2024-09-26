import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { ResetPasswordComponent } from 'app/main/pages/authentication/reset-password/reset-password.component';
import { AppMaterialModule } from 'app/app-material/app-material.module';

const routes = [
    {
        path: 'auth/reset-password', component: ResetPasswordComponent
    }
];

@NgModule({
    declarations: [
        ResetPasswordComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        AppMaterialModule,
        FuseSharedModule
    ]
})
export class ResetPasswordModule { }
