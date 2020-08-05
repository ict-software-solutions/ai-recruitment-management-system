import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { AuthGuard } from 'app/service/shared/auth.guard';
import { MatButtonModule } from '@angular/material/button';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

const routes = [
    {
        path: 'dashboards/analytics',
        loadChildren: () => import('./dashboards/analytics/analytics.module').then(m => m.AnalyticsDashboardModule),
        canActivate: [AuthGuard]
    },

    {
        path: 'mail',
        loadChildren: () => import('./mail/mail.module').then(m => m.MailModule),
        canActivate: [AuthGuard]
    },

    {
        path: 'calendar',
        loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'e-commerce',
        loadChildren: () => import('./usermanagement/usermanagement.module').then(m => m.EcommerceModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.UIModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'contacts',
        loadChildren: () => import('./contacts/contacts.module').then(m => m.ContactsModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'scrumboard',
        loadChildren: () => import('./scrumboard/scrumboard.module').then(m => m.ScrumboardModule),
        canActivate: [AuthGuard]
    }, {
        path: 'chat',
        loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule),
        canActivate: [AuthGuard]
    }, {
        path: 'configuration',
        loadChildren: () => import('./configuration/configuration.module').then(m=>m.ConfigurationModule),
        canActivate: [AuthGuard]
    }
];

@NgModule({
    declarations: [
        FuseConfirmDialogComponent
       
    ],
    imports: [
        RouterModule.forChild(routes),
        FuseSharedModule,
        MatButtonModule
    ],
    exports:[
        FuseConfirmDialogComponent
    ],
    entryComponents: [
        FuseConfirmDialogComponent
    ],
})
export class AppsModule { }
