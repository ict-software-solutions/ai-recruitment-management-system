import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { ProfileComponent } from 'app/main/pages/profile/profile.component';
import { ProfileService } from 'app/main/pages/profile/profile.service';
import { ProfileAboutComponent } from 'app/main/pages/profile/tabs/about/about.component';
import { ProfilePhotosVideosComponent } from 'app/main/pages/profile/tabs/photos-videos/photos-videos.component';
import { ProfileTimelineComponent } from 'app/main/pages/profile/tabs/timeline/timeline.component';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { ResetPasswordModule } from 'app/main/pages/authentication/reset-password/reset-password.module';

const routes = [
    {
        path: '',
        component: ProfileComponent
    }
];

@NgModule({
    declarations: [
        ProfileComponent,
        ProfileTimelineComponent,
        ProfileAboutComponent,
        ProfilePhotosVideosComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatTabsModule,
        FuseSharedModule,
        MatCardModule,
        MatGridListModule,
        MatTableModule,
        MatDialogModule,
        ResetPasswordModule
        // ResetPasswordComponent 

    ],
    providers: [
        ProfileService
    ]
})
export class ProfileModule {
}
