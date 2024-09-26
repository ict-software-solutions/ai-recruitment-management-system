import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FuseSidebarModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { AppMaterialModule } from 'app/app-material/app-material.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ConfigurationComponent, DialogOverviewExampleDialog } from './configuration.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

const routes: Routes = [
    {
        path: '**',
        component: ConfigurationComponent,
        children: []
    }
];

@NgModule({
    declarations: [
        ConfigurationComponent,
        DialogOverviewExampleDialog
    ],
    imports: [
        RouterModule.forChild(routes),
        FuseSharedModule,
        FuseSidebarModule,
        AppMaterialModule,
        FuseSharedModule,
        MatButtonToggleModule,
        MatTableModule,
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule


    ],

    entryComponents: [DialogOverviewExampleDialog,
    ],

    providers: []
})
export class ConfigurationModule { }
