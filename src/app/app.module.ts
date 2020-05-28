import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';
import {MatTableModule} from '@angular/material/table';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { FakeDbService } from 'app/fake-db/fake-db.service';
import { AppComponent } from 'app/app.component';
import { AppStoreModule } from 'app/store/store.module';
import { LayoutModule } from 'app/layout/layout.module';
// import { StudentComponent} from 'app/main/apps/student';

const appRoutes: Routes = [
    {
        path        : '',
        loadChildren: () => import('./main/pages/authentication/login/login.module').then(m => m.LoginModule)
    },
    {
        path        : 'apps',
        loadChildren: () => import('./main/apps/apps.module').then(m => m.AppsModule)
    },
    {
        path        : 'pages',
        loadChildren: () => import('./main/pages/pages.module').then(m => m.PagesModule)
    },
    {
        path        : 'ui',
        loadChildren: () => import('./main/ui/ui.module').then(m => m.UIModule)
    },
    {
        path        : 'documentation',
        loadChildren: () => import('./main/documentation/documentation.module').then(m => m.DocumentationModule)
    },
    {
        path      : '**',
        redirectTo: ''
    }
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes,{enableTracing:false}),

        TranslateModule.forRoot(),
        InMemoryWebApiModule.forRoot(FakeDbService, {
            delay             : 0,
            passThruUnknownUrl: true
        }),

        // Material moment date module
        MatMomentDateModule,
        MatTableModule,
        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        AppStoreModule
    ],
    bootstrap   : [
        AppComponent
    ],
    schemas:[CUSTOM_ELEMENTS_SCHEMA]

})
export class AppModule
{
}
