import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { AcademyCoursesService } from 'app/main/apps/academy/courses.service';
import { MailComposeDialogComponent } from 'app/main/apps/mail/dialogs/compose/compose.component';
import { FormBuilder, FormGroup } from '@angular/forms';
// import {MatDialogModule} from '@angular/material/dialog';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
// import { CoursesDialogComponent } from './courses-dialog/courses-dialog.component';




@Component({
    selector   : 'academy-courses',
    templateUrl: './courses.component.html',
    styleUrls  : ['./courses.component.scss'],
    animations : fuseAnimations
})
// export interface Tile {
//     color: string;
//     cols: number;
//     rows: number;
//     text: string;
//   }
//   export class GridListDynamicExample {
//     tiles: Tile[] = [
//       {text: 'One', cols: 3, rows: 1, color: 'lightblue'},
//       {text: 'Two', cols: 1, rows: 2, color: 'lightgreen'},
//       {text: 'Three', cols: 1, rows: 1, color: 'lightpink'},
//       {text: 'Four', cols: 2, rows: 1, color: '#DDBDF1'},
//     ];
//   }
export class AcademyCoursesComponent implements OnInit, OnDestroy
{
    categories: any[];
    courses: any[];
    coursesFilteredByCategory: any[];
    filteredCourses: any[];
    currentCategory: string;
    searchTerm: string;
    dialogRef: any;
    statusForm: FormGroup;

    // confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {AcademyCoursesService} _academyCoursesService
     * @param {MatDialog} _matDialog
    //  *
     */

    // @param {FormBuilder} _formBuilder
    //  * @param {MatDialog} _matDialog
    constructor(
        private _academyCoursesService: AcademyCoursesService,
        private _formBuilder: FormBuilder,
        // private _formBuilder: FormBuilder,
        public _matDialog: MatDialog
    )
    {
        // Set the defaults
        this.currentCategory = 'all';
        this.searchTerm = '';

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    
    composeDialog(): void
    {
        this.dialogRef = this._matDialog.open(MailComposeDialogComponent, {
            panelClass: 'mail-compose-dialog'
        });
        this.dialogRef.afterClosed()
            .subscribe(response => {
                if ( !response )
                {
                    return;
                }
                const actionType: string = response[0];
                const formData: FormGroup = response[1];
                switch ( actionType )
                {
                    /**
                     * Send
                     */
                    case 'send':
                        console.log('new Mail', formData.getRawValue());
                        break;
                    /**
                     * Delete
                     */
                    case 'delete':
                        console.log('delete Mail');
                        break;
                }
            }
            );
    }
    // GridListDynamicExample
    // tiles: Tile[] = [
    //     {text: 'One', cols: 3, rows: 1, color: 'lightblue'},
    //     {text: 'Two', cols: 1, rows: 2, color: 'lightgreen'},
    //     {text: 'Three', cols: 1, rows: 1, color: 'lightpink'},
    //     {text: 'Four', cols: 2, rows: 1, color: '#DDBDF1'},
    //   ];
    // }
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Subscribe to categories
        this._academyCoursesService.onCategoriesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(categories => {
                this.categories = categories;
            });

        // Subscribe to courses
        this._academyCoursesService.onCoursesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(courses => {
                this.filteredCourses = this.coursesFilteredByCategory = this.courses = courses;
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Filter courses by category
     */
    filterCoursesByCategory(): void
    {
        // Filter
        if ( this.currentCategory === 'all' )
        {
            this.coursesFilteredByCategory = this.courses;
            this.filteredCourses = this.courses;
        }
        else
        {
            this.coursesFilteredByCategory = this.courses.filter((course) => {
                return course.category === this.currentCategory;
            });

            this.filteredCourses = [...this.coursesFilteredByCategory];

        }

        // Re-filter by search term
        this.filterCoursesByTerm();
    }

    /**
     * Filter courses by term
     */
    filterCoursesByTerm(): void
    {
        const searchTerm = this.searchTerm.toLowerCase();

        // Search
        if ( searchTerm === '' )
        {
            this.filteredCourses = this.coursesFilteredByCategory;
        }
        else
        {
            this.filteredCourses = this.coursesFilteredByCategory.filter((course) => {
                return course.title.toLowerCase().includes(searchTerm);
            });
        }
    }
}
