import { NgModule } from '@angular/core';
import { ForgotPasswordModule } from 'app/main/pages/authentication/forgot-password/forgot-password.module';
import { LockModule } from 'app/main/pages/authentication/lock/lock.module';
import { LoginModule } from 'app/main/pages/authentication/login/login.module';
import { MailConfirmModule } from 'app/main/pages/authentication/mail-confirm/mail-confirm.module';
import { RegisterModule } from 'app/main/pages/authentication/register/register.module';
import { ResetPasswordModule } from 'app/main/pages/authentication/reset-password/reset-password.module';

@NgModule({
        imports: [
                LoginModule,
                RegisterModule,
                ForgotPasswordModule,
                ResetPasswordModule,
                LockModule,
                MailConfirmModule,
        ]
})

export class PagesModule { }