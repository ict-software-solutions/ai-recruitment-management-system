import { NgModule } from '@angular/core';
import { AppMaterialModule } from 'app/app-material/app-material.module';
import { UIFormsModule } from 'app/main/apps/profile/forms/forms.module';
import { ResetPasswordModule } from 'app/main/pages/authentication/reset-password/reset-password.module';
@NgModule({
    imports: [
        UIFormsModule,
        AppMaterialModule,
        ResetPasswordModule,
    ],
})
export class UIModule {
}
