import { NgModule } from '@angular/core';
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
        RouterModule.forChild(routes),
        FuseSharedModule,
        FuseSidebarModule,
        AppMaterialModule,
        FuseSharedModule,
    ],
    providers: [
        ChatService
    ]
})
export class ChatModule { }
