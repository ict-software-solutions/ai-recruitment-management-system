import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { MatGridListModule } from "@angular/material/grid-list";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from "@fuse/components";
import { FuseModule } from "@fuse/fuse.module";
import { FuseSharedModule } from "@fuse/shared.module";
import { Keepalive, NgIdleKeepaliveModule } from "@ng-idle/keepalive";
import { TranslateModule } from "@ngx-translate/core";
import { InMemoryWebApiModule } from "angular-in-memory-web-api";
import { AppComponent } from "app/app.component";
import { FakeDbService } from "app/fake-db/fake-db.service";
import { fuseConfig } from "app/fuse-config";
import { LayoutModule } from "app/layout/layout.module";
import { AppStoreModule } from "app/store/store.module";
import "hammerjs";
import { AppMaterialModule } from './app-material/app-material.module';
import { AuthGuard } from './service/shared/auth.guard';
import { LogPublishersService } from "./service/shared/log-publishers.service";
import { LogService } from "./service/shared/log.service";
import { TokenInterceptor } from './service/shared/token.interceptor';

const appRoutes: Routes = [
    {
        path: "",
        loadChildren: () => import("./main/pages/authentication/login/login.module").then((m) => m.LoginModule)
    }, {
        path: "apps",
        loadChildren: () => import("./main/apps/apps.module").then((m) => m.AppsModule),
        // canActivate: [AuthGuard]
    }, {
        path: "pages",
        loadChildren: () => import("./main/pages/pages.module").then((m) => m.PagesModule)
    }, {
        path: "**",
        redirectTo: "",
    }
];

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppMaterialModule,
        RouterModule.forRoot(appRoutes, { enableTracing: false, useHash: true }),
        TranslateModule.forRoot(),
        InMemoryWebApiModule.forRoot(FakeDbService, {
            delay: 0,
            passThruUnknownUrl: true,
        }),
        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,
        MatGridListModule,
        NgIdleKeepaliveModule,
        // App modules
        LayoutModule,
        AppStoreModule
    ],
    bootstrap: [AppComponent],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        }, LogService, LogPublishersService, Keepalive,
            AuthGuard],

    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
