import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UIFormsModule } from 'app/main/apps/profile/forms/forms.module';
import { ResetPasswordModule } from 'app/main/pages/authentication/reset-password/reset-password.module';
import { MatDialogModule } from '@angular/material/dialog';
@NgModule({
    imports: [
        UIFormsModule,
        MatDatepickerModule,
        MatCardModule,
        MatProgressBarModule,
        MatIconModule,
        MatToolbarModule,
        ResetPasswordModule ,
        MatDialogModule
    ],
    exports: [
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule
    ],
})
export class UIModule {
}
