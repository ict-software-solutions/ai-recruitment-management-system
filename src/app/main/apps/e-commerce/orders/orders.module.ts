import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


// import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';

import { MailService } from 'app/main/apps/mail/mail.service';
import { MailComponent } from 'app/main/apps/mail/mail.component';
import { MailListComponent } from 'app/main/apps/mail/mail-list/mail-list.component';
import { MailListItemComponent } from 'app/main/apps/mail/mail-list/mail-list-item/mail-list-item.component';
import { MailDetailsComponent } from 'app/main/apps/mail/mail-details/mail-details.component';
import { MailMainSidebarComponent } from 'app/main/apps/mail/sidebars/main/main-sidebar.component';
import { MailComposeDialogComponent } from 'app/main/apps/mail/dialogs/compose/compose.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatRippleModule,
  MatSelectModule,
  MatToolbarModule,
  MailComposeDialogComponent,

  TranslateModule,

  FuseSharedModule,
  FuseSidebarModule
  ],
  
entryComponents: [
  MailComposeDialogComponent
]
})
export class OrdersModule { }



