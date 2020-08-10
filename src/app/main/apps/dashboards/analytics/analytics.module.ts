import { AgmCoreModule } from '@agm/core';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AppMaterialModule } from 'app/app-material/app-material.module';
import { AnalyticsDashboardComponent } from 'app/main/apps/dashboards/analytics/analytics.component';
import { AnalyticsDashboardService } from 'app/main/apps/dashboards/analytics/analytics.service';
import { AuthGuard } from 'app/service/shared/auth.guard';
import { ChartsModule } from 'ng2-charts';

const routes: Routes = [
    {
        path: '**',
        component: AnalyticsDashboardComponent,
        canActivate: [AuthGuard],
        resolve: { data: AnalyticsDashboardService }
    }
];

@NgModule({
    declarations: [
        AnalyticsDashboardComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        AppMaterialModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyD81ecsCj4yYpcXSLFcYU97PvRsE_X8Bx8'
        }),
        ChartsModule,
        NgxChartsModule,
        FuseSharedModule,
        FuseWidgetModule
    ],
    providers: [
        AnalyticsDashboardService,
        AuthGuard
    ]
})
export class AnalyticsDashboardModule {
}

