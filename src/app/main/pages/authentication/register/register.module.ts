import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { AppMaterialModule } from 'app/app-material/app-material.module';
import { RegisterComponent } from 'app/main/pages/authentication/register/register.component';

const routes = [
    {
        path: 'auth/register',
        component: RegisterComponent
    }
];

@NgModule({
    declarations: [
        RegisterComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        FuseSharedModule,
        ReactiveFormsModule,
        AppMaterialModule
    ]
})
export class RegisterModule { }
