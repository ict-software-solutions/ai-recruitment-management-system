import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FuseConfirmDialogModule, FuseMaterialColorPickerModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgxDnDModule } from '@swimlane/ngx-dnd';
import { AppMaterialModule } from 'app/app-material/app-material.module';
import { ScrumboardBoardAddListComponent } from 'app/main/apps/scrumboard/board/add-list/add-list.component';
import { ScrumboardBoardComponent } from 'app/main/apps/scrumboard/board/board.component';
import { ScrumboardCardDialogComponent } from 'app/main/apps/scrumboard/board/dialogs/card/card.component';
import { ScrumboardLabelSelectorComponent } from 'app/main/apps/scrumboard/board/dialogs/card/label-selector/label-selector.component';
import { ScrumboardEditBoardNameComponent } from 'app/main/apps/scrumboard/board/edit-board-name/edit-board-name.component';
import { ScrumboardBoardAddCardComponent } from 'app/main/apps/scrumboard/board/list/add-card/add-card.component';
import { ScrumboardBoardCardComponent } from 'app/main/apps/scrumboard/board/list/card/card.component';
import { ScrumboardBoardEditListNameComponent } from 'app/main/apps/scrumboard/board/list/edit-list-name/edit-list-name.component';
import { ScrumboardBoardListComponent } from 'app/main/apps/scrumboard/board/list/list.component';
import { ScrumboardBoardColorSelectorComponent } from 'app/main/apps/scrumboard/board/sidenavs/settings/board-color-selector/board-color-selector.component';
import { ScrumboardBoardSettingsSidenavComponent } from 'app/main/apps/scrumboard/board/sidenavs/settings/settings.component';
import { ScrumboardComponent } from 'app/main/apps/scrumboard/scrumboard.component';
import { BoardResolve, ScrumboardService } from 'app/main/apps/scrumboard/scrumboard.service';

const routes: Routes = [
    {
        path: 'boards',
        component: ScrumboardComponent,
        resolve: { scrumboard: ScrumboardService }
    }, {
        path: 'boards/:boardId/:boardUri',
        component: ScrumboardBoardComponent,
        resolve: { board: BoardResolve }
    },
    {
        path: '**',
        redirectTo: 'boards'
    }
];

@NgModule({
    declarations: [
        ScrumboardComponent,
        ScrumboardBoardComponent,
        ScrumboardBoardListComponent,
        ScrumboardBoardCardComponent,
        ScrumboardBoardEditListNameComponent,
        ScrumboardBoardAddCardComponent,
        ScrumboardBoardAddListComponent,
        ScrumboardCardDialogComponent,
        ScrumboardLabelSelectorComponent,
        ScrumboardEditBoardNameComponent,
        ScrumboardBoardSettingsSidenavComponent,
        ScrumboardBoardColorSelectorComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        AppMaterialModule,
        NgxDnDModule,
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseMaterialColorPickerModule
    ],
    providers: [
        ScrumboardService,
        BoardResolve
    ],
    entryComponents: [ScrumboardCardDialogComponent]
})
export class ScrumboardModule {
}
