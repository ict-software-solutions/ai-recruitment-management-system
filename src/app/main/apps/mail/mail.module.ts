import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Routes } from '@angular/router';
import { FuseSidebarModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { MailComposeDialogComponent } from 'app/main/apps/mail/dialogs/compose/compose.component';
import { MailDetailsComponent } from 'app/main/apps/mail/mail-details/mail-details.component';
import { MailListItemComponent } from 'app/main/apps/mail/mail-list/mail-list-item/mail-list-item.component';
import { MailListComponent } from 'app/main/apps/mail/mail-list/mail-list.component';
import { MailComponent } from 'app/main/apps/mail/mail.component';
import { MailService } from 'app/main/apps/mail/mail.service';
import { MailMainSidebarComponent } from 'app/main/apps/mail/sidebars/main/main-sidebar.component';
import { AuthGuard } from 'app/service/shared/auth.guard';

const routes: Routes = [
    {
        path: 'label/:labelHandle',
        component: MailComponent,
        resolve: { mail: MailService },
        canActivate: [AuthGuard]
    },
    {
        path: 'label/:labelHandle/:mailId',
        component: MailComponent,
        resolve: { mail: MailService },
        canActivate: [AuthGuard]
    },
    {
        path: 'filter/:filterHandle',
        component: MailComponent,
        resolve: { mail: MailService },
        canActivate: [AuthGuard]
    },
    {
        path: 'filter/:filterHandle/:mailId',
        component: MailComponent,
        resolve: { mail: MailService },
        canActivate: [AuthGuard]
    },
    {
        path: ':folderHandle',
        component: MailComponent,
        resolve: { mail: MailService },
        canActivate: [AuthGuard]
    },
    {
        path: ':folderHandle/:mailId',
        component: MailComponent,
        resolve: { mail: MailService },
        canActivate: [AuthGuard]
    },
    {
        path: '**',
        redirectTo: 'inbox'
    }
];

@NgModule({
    declarations: [
        MailComponent,
        MailListComponent,
        MailListItemComponent,
        MailDetailsComponent,
        MailMainSidebarComponent,
        MailComposeDialogComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MatButtonModule,
        MatCheckboxModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatRippleModule,
        MatSelectModule,
        MatToolbarModule,
        TranslateModule,
        FuseSharedModule,
        FuseSidebarModule
    ],
    providers: [
        MailService
    ],
    entryComponents: [
        MailComposeDialogComponent
    ]
})
export class MailModule {
}
