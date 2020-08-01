import { AgmCoreModule } from '@agm/core';
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
// import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
// import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';


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
        // FuseConfirmDialogComponent
       
    ],
    imports: [
        RouterModule.forChild(routes),
        AppMaterialModule,
        NgxChartsModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyD81ecsCj4yYpcXSLFcYU97PvRsE_X8Bx8'
        }),
        FuseSharedModule,
        FuseWidgetModule
    ],
    // exports:[
    //     FuseConfirmDialogComponent
    // ],
    // entryComponents: [
    //     FuseConfirmDialogComponent
    // ],
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
