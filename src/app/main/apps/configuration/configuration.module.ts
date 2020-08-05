import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FuseSidebarModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { AppMaterialModule } from 'app/app-material/app-material.module';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { ConfigurationComponent } from './configuration.component';

const routes: Routes = [
    {
        path: '**',
        component: ConfigurationComponent,
        children: []
    }
];

@NgModule({
    declarations: [
        ConfigurationComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        FuseSharedModule,
        FuseSidebarModule,
        AppMaterialModule,
        FuseSharedModule,
        MatButtonToggleModule,
    ],
    providers: []
})
export class ConfigurationModule { }
