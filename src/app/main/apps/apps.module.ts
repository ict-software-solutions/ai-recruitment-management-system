import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatButtonModule } from '@angular/material/button';

const routes = [
    {
        path: 'dashboards/analytics',
        loadChildren: () => import('./dashboards/analytics/analytics.module').then(m => m.AnalyticsDashboardModule)
    },

    {
        path: 'mail',
        loadChildren: () => import('./mail/mail.module').then(m => m.MailModule)
    },

    {
        path: 'calendar',
        loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarModule)
    },
    {
        path        : 'e-commerce',
        loadChildren: () => import('./usermanagement/usermanagement.module').then(m => m.EcommerceModule)
    },
    {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.UIModule)
    },
    {
        path: 'contacts',
        loadChildren: () => import('./contacts/contacts.module').then(m => m.ContactsModule)
    },
    {
        path: 'scrumboard',
        loadChildren: () => import('./scrumboard/scrumboard.module').then(m => m.ScrumboardModule)
    },
    {
        path        : 'chat',
        loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule)
    },
   
   
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
export class AppsModule {
}
