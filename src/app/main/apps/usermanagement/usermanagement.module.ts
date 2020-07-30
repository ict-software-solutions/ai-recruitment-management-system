import { AgmCoreModule } from '@agm/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule, Routes } from '@angular/router';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { EcommerceProductComponent } from 'app/main/apps/usermanagement/addusers/addusers.component';
import { EcommerceProductService } from 'app/main/apps/usermanagement/addusers/addusers.service';
import { EcommerceProductsComponent } from 'app/main/apps/usermanagement/users/users.component';
import { UserManagementService } from 'app/main/apps/usermanagement/users/users.service';
import { TokenInterceptor } from 'app/service/shared/token.interceptor';

const routes: Routes = [
    {
        path: 'products',
        component: EcommerceProductsComponent,
        resolve: {
            data: UserManagementService
        }
    },
    {
        path: 'products/:id',
        component: EcommerceProductComponent,
        resolve: {
            data: EcommerceProductService
        }
    },
    {
        path: 'products/:id/:handle',
        component: EcommerceProductComponent,
        resolve: {
            data: EcommerceProductService
        }
    },

];

@NgModule({
    declarations: [
        EcommerceProductsComponent,
        EcommerceProductComponent
    ],
    imports: [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatChipsModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatRippleModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatSortModule,
        MatSnackBarModule,
        MatTableModule,
        MatTabsModule,
        MatDialogModule,
        MatDatepickerModule,
        MatRadioModule,
        MatCheckboxModule,
        MatCardModule,

        NgxChartsModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyD81ecsCj4yYpcXSLFcYU97PvRsE_X8Bx8'
        }),

        FuseSharedModule,
        FuseWidgetModule
    ],
    providers: [
        UserManagementService,
        EcommerceProductService

    ]
})
export class EcommerceModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: EcommerceModule,
            providers: [{
                provide: HTTP_INTERCEPTORS,
                useClass: TokenInterceptor,
                multi: true
            }]
        };
    }
}
