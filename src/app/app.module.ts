import { HttpClientModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from "@fuse/components";
import { FuseModule } from "@fuse/fuse.module";
import { FuseSharedModule } from "@fuse/shared.module";
import { TranslateModule } from "@ngx-translate/core";
import { InMemoryWebApiModule } from "angular-in-memory-web-api";
import { AppComponent } from "app/app.component";
import { FakeDbService } from "app/fake-db/fake-db.service";
import { fuseConfig } from "app/fuse-config";
import { LayoutModule } from "app/layout/layout.module";
import { AppStoreModule } from "app/store/store.module";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatCardModule } from "@angular/material/card";
import "hammerjs";
import { LogPublishersService } from "./service/shared/log-publishers.service";
import { LogService } from "./service/shared/log.service";
import { Keepalive, NgIdleKeepaliveModule } from "@ng-idle/keepalive";
import { MatRadioModule } from "@angular/material/radio";

const appRoutes: Routes = [
  {
    path: "",
    loadChildren: () => import("./main/pages/authentication/login/login.module").then((m) => m.LoginModule),
  },
  {
    path: "apps",
    loadChildren: () => import("./main/apps/apps.module").then((m) => m.AppsModule),
  },
  {
    path: "pages",
    loadChildren: () => import("./main/pages/pages.module").then((m) => m.PagesModule),
  },
  // {
  //     path: 'ui',
  //     loadChildren: () => import('./main/ui/ui.module').then(m => m.UIModule)
  // },

  {
    path: "**",
    redirectTo: "",
  },
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, { enableTracing: false }),

    TranslateModule.forRoot(),
    InMemoryWebApiModule.forRoot(FakeDbService, {
      delay: 0,
      passThruUnknownUrl: true,
    }),

    // Material moment date module
    MatMomentDateModule,
    MatTableModule,
    // Material
    MatButtonModule,
    MatIconModule,
    MatRadioModule,

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
    AppStoreModule,
    MatCardModule,
  ],
  bootstrap: [AppComponent],
  providers: [LogService, LogPublishersService, Keepalive],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
