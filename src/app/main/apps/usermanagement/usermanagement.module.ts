import { AgmCoreModule } from '@agm/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AppMaterialModule } from 'app/app-material/app-material.module';
import { EcommerceProductComponent } from 'app/main/apps/usermanagement/addusers/addusers.component';
import { EcommerceProductService } from 'app/main/apps/usermanagement/addusers/addusers.service';
import { EcommerceProductsComponent } from 'app/main/apps/usermanagement/users/users.component';
import { UserManagementService } from 'app/main/apps/usermanagement/users/users.service';
import { TokenInterceptor } from 'app/service/shared/token.interceptor';

const routes: Routes = [
    {
        path: 'products',
        component: EcommerceProductsComponent,
        resolve: { data: UserManagementService }
    },
    {
        path: 'products/:id',
        component: EcommerceProductComponent,
        resolve: { data: EcommerceProductService }
    },
    {
        path: 'products/:id/:handle',
        component: EcommerceProductComponent,
        resolve: { data: EcommerceProductService }
    },
];

@NgModule({
    declarations: [
        EcommerceProductsComponent,
        EcommerceProductComponent,
    ],
    imports: [
        CommonModule,
        AppMaterialModule,
        NgxChartsModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyD81ecsCj4yYpcXSLFcYU97PvRsE_X8Bx8'
        }),
        RouterModule.forChild(routes),
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
