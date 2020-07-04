import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule, Routes } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { FormsComponent } from 'app/main/apps/profile/forms/forms.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { DatePipe } from '@angular/common';
const routes: Routes = [
    {
        path: 'forms',
        component: FormsComponent
    }
];

@NgModule({
    declarations: [
        FormsComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatStepperModule,
        MatDatepickerModule,
        MatDialogModule,
        MatCardModule,
        FuseSharedModule,
        MatCheckboxModule,
        ClipboardModule
    ],
    providers: [
        DatePipe
    ],
    exports: [
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        
    ]

})
export class UIFormsModule {

}
