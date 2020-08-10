import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { RouterModule, Routes } from '@angular/router';
import { FuseSidebarModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { AppMaterialModule } from 'app/app-material/app-material.module';
import { ChatComponent } from 'app/main/apps/chat/chat.component';
import { ChatService } from 'app/main/apps/chat/chat.service';

const routes: Routes = [
    {
        path: '**',
        component: ChatComponent,
        children: [],
        resolve: { chat: ChatService }
    }
];

@NgModule({
    declarations: [
        ChatComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FuseSharedModule,
        FuseSidebarModule,
        AppMaterialModule,
        FuseSharedModule,
        MatButtonToggleModule,
    ],
    providers: [
        ChatService,
        DatePipe
    ]
})
export class ChatModule { }
