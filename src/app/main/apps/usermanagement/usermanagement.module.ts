import { AgmCoreModule } from '@agm/core';
import { NgModule } from '@angular/core';
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
import { EcommerceProductComponent } from 'app/main/apps/usermanagement/product/product.component';
import { EcommerceProductService } from 'app/main/apps/usermanagement/product/product.service';
import { EcommerceProductsComponent } from 'app/main/apps/usermanagement/products/products.component';
import { EcommerceProductsService } from 'app/main/apps/usermanagement/products/products.service';
// import { EcommerceOrdersComponent } from 'app/main/apps/user/orders/orders.component';
// import { EcommerceOrdersService } from 'app/main/apps/e-comme/orders/orders.service';
// import { EcommerceOrderComponent } from 'app/main/apps/e-commerce/order/order.component';
// import { EcommerceOrderService } from 'app/main/apps/e-commerce/order/order.service';

const routes: Routes = [
    {
        path: 'products',
        component: EcommerceProductsComponent,
        resolve: {
            data: EcommerceProductsService
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
    // {
    //     path     : 'orders',
    //     component: EcommerceOrdersComponent,
    //     resolve  : {
    //         data: EcommerceOrdersService
    //     }
    // },
    // {
    //     path     : 'orders/:id',
    //     component: EcommerceOrderComponent,
    //     resolve  : {
    //         data: EcommerceOrderService
    //     }
    // }
];

@NgModule({
    declarations: [
        EcommerceProductsComponent,
        EcommerceProductComponent
        // EcommerceOrdersComponent,
        // EcommerceOrderComponent
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
        EcommerceProductsService,
        EcommerceProductService
        // EcommerceOrdersService,
        // EcommerceOrderService
    ]
})
export class EcommerceModule {
}
