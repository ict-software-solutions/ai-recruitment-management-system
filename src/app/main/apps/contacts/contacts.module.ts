import { DragDropModule } from '@angular/cdk/drag-drop';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Routes } from '@angular/router';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { ContactsContactFormDialogComponent } from 'app/main/apps/contacts/contact-form/contact-form.component';
import { ContactsContactListComponent } from 'app/main/apps/contacts/contact-list/contact-list.component';
import { ContactsComponent } from 'app/main/apps/contacts/contacts.component';
import { ContactsService } from 'app/main/apps/contacts/contacts.service';
import { ContactsSelectedBarComponent } from 'app/main/apps/contacts/selected-bar/selected-bar.component';
import { TokenInterceptor } from 'app/service/shared/token.interceptor';
// import { shadows } from '@material-ui/system';

const routes: Routes = [{
        path: 'addRole',
        component: ContactsContactFormDialogComponent
    }, {
        path: '**',
        component: ContactsComponent,
        resolve: {
            contacts: ContactsService
        }
    }
];

@NgModule({
    declarations: [
        ContactsComponent,
        ContactsContactListComponent,
        ContactsSelectedBarComponent,
        ContactsContactFormDialogComponent,
    ],
    imports: [
        RouterModule.forChild(routes),
        DragDropModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatRippleModule,
        MatTableModule,
        MatToolbarModule,
        MatCardModule,
        MatListModule,
        MatPaginatorModule,
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        MatSelectModule,
        MatRadioModule,
        MatGridListModule

    ],
    exports:[DragDropModule],
    providers: [ContactsService],
    entryComponents: [ContactsContactFormDialogComponent]
})
export class ContactsModule
{
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
