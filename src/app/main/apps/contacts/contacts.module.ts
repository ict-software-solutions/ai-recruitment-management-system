import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { AppMaterialModule } from 'app/app-material/app-material.module';
import { ContactsContactFormDialogComponent } from 'app/main/apps/contacts/contact-form/contact-form.component';
import { ContactsContactListComponent } from 'app/main/apps/contacts/contact-list/contact-list.component';
import { ContactsComponent } from 'app/main/apps/contacts/contacts.component';
import { ContactsService } from 'app/main/apps/contacts/contacts.service';
import { ContactsSelectedBarComponent } from 'app/main/apps/contacts/selected-bar/selected-bar.component';
import { TokenInterceptor } from 'app/service/shared/token.interceptor';
// import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

const routes: Routes = [{
    path: 'addRole',
    component: ContactsContactFormDialogComponent
}, {
    path: '**',
    component: ContactsComponent,
    resolve: { contacts: ContactsService }
}
];

@NgModule({
    declarations: [
        ContactsComponent,
        ContactsContactListComponent,
        ContactsSelectedBarComponent,
        ContactsContactFormDialogComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        DragDropModule,
        AppMaterialModule,
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
    ],
    exports: [DragDropModule],
    providers: [ContactsService],
    entryComponents: [ContactsContactFormDialogComponent]
})
export class ContactsModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ContactsModule,
            providers: [{
                provide: HTTP_INTERCEPTORS,
                useClass: TokenInterceptor,
                multi: true
            }]
        };
    }
}
