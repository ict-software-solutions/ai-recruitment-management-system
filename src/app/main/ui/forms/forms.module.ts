import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { FuseSharedModule } from '@fuse/shared.module';
import {MatDialogModule} from '@angular/material/dialog';
import { FormsComponent } from 'app/main/ui/forms/forms.component';

import {MatCardModule} from '@angular/material/card';
// import {
//     MatButtonModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatRippleModule
//   } from '@angular/material';
const routes: Routes = [
    {
        path     : 'forms',
        component: FormsComponent
    }
];

@NgModule({
    declarations: [
        FormsComponent
    ],
    imports     : [
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
    ],
    exports: [
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule
       
      ]

})
export class UIFormsModule
{
   
}
