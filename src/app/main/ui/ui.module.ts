import { NgModule } from '@angular/core';

// import { UIAngularMaterialModule } from 'app/main/ui/angular-material/angular-material.module';
// import { UICardsModule } from 'app/main/ui/cards/cards.module';
import { UIFormsModule } from 'app/main/ui/forms/forms.module';
// import { UIIconsModule } from 'app/main/ui/icons/icons.module';
// import { UITypographyModule } from 'app/main/ui/typography/typography.module';
// import { UIHelperClassesModule } from 'app/main/ui/helper-classes/helper-classes.module';
// import { UIPageLayoutsModule } from 'app/main/ui/page-layouts/page-layouts.module';
// import { UIColorsModule } from 'app/main/ui/colors/colors.module';
import {MatDatepickerModule} from '@angular/material/datepicker';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
// import { UploadComponent } from './upload/upload.component';
import {MatCardModule} from '@angular/material/card';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';


@NgModule({
    imports: [
        // UIAngularMaterialModule,
        // UICardsModule,
        UIFormsModule,
        // UIIconsModule,
        // UITypographyModule,
        // UIHelperClassesModule,
        // UIPageLayoutsModule,
        // UIColorsModule,
        MatDatepickerModule,
        // MatDialogModule,
        MatCardModule,
        MatProgressBarModule,
        MatIconModule,
        MatToolbarModule
    ],
    exports: [
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule
       
      ],
    // declarations: [UploadComponent]
})
export class UIModule
{
}
