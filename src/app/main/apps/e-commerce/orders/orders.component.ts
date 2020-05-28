import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { EcommerceOrdersService } from 'app/main/apps/e-commerce/orders/orders.service';
import { takeUntil } from 'rxjs/internal/operators';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';



import { FormGroup } from '@angular/forms';


import { MailService } from 'app/main/apps/mail/mail.service';
import { MailComposeDialogComponent } from 'app/main/apps/mail/dialogs/compose/compose.component';
@Component({
    selector     : 'e-commerce-orders',
    templateUrl  : './orders.component.html',
    styleUrls    : ['./orders.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class EcommerceOrdersComponent implements OnInit, OnDestroy
{
    dataSource: FilesDataSource | null;
    displayedColumns = ['cname','edu_qual','domain','exp','contact','can_status','active' ];

    @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;

    @ViewChild('filter', {static: true})
    filter: ElementRef;

    @ViewChild(MatSort, {static: true})
    sort: MatSort;


    dialogRef: any;
    // confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {EcommerceOrdersService} _ecommerceOrdersService
     *  @param {MatDialog} _matDialog
     * 
     * 
     */
    constructor(public dialog: MatDialog,
        private _ecommerceOrdersService: EcommerceOrdersService,
        public _matDialog: MatDialog
    )
    {
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
    // openDialog(): void {
    //     const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
    //       width: '250px',
    //     //   data: {name: this.name, animal: this.animal}
    //     });
    
    //     dialogRef.afterClosed().subscribe(result => {
    //       console.log('The dialog was closed');
    //     //   this.animal = result;
    //     });
    // }
    // openMail(): void {
    //     const dialogRef = this.dialog.open(MailOverview, {
    //       width: '400px',
    //       height:'400px',
          
    //     //   data: {name: this.name, animal: this.animal}
    //     });
    
    //     dialogRef.afterClosed().subscribe(result => {
    //       console.log('The dialog was closed');
    //     //   this.animal = result;
    //     });
    // }
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.dataSource = new FilesDataSource(this._ecommerceOrdersService, this.paginator, this.sort);

        fromEvent(this.filter.nativeElement, 'keyup')
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(150),
                distinctUntilChanged()
            )
            .subscribe(() => {
                if ( !this.dataSource )
                {
                    return;
                }
                this.dataSource.filter = this.filter.nativeElement.value;
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
}

export class FilesDataSource extends DataSource<any>
{
    // Private
    private _filterChange = new BehaviorSubject('');
    private _filteredDataChange = new BehaviorSubject('');

    /**
     * Constructor
     *
     * @param {EcommerceOrdersService} _ecommerceOrdersService
     * @param {MatPaginator} _matPaginator
     * @param {MatSort} _matSort
     */
    constructor(
        private _ecommerceOrdersService: EcommerceOrdersService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort
    )
    {
        super();

        this.filteredData = this._ecommerceOrdersService.orders;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    // Filtered data
    get filteredData(): any
    {
        return this._filteredDataChange.value;
    }

    set filteredData(value: any)
    {
        this._filteredDataChange.next(value);
    }

    // Filter
    get filter(): string
    {
        return this._filterChange.value;
    }

    set filter(filter: string)
    {
        this._filterChange.next(filter);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     *
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]>
    {
        const displayDataChanges = [
            this._ecommerceOrdersService.onOrdersChanged,
            this._matPaginator.page,
            this._filterChange,
            this._matSort.sortChange
        ];

        return merge(...displayDataChanges).pipe(map(() => {

                let data = this._ecommerceOrdersService.orders.slice();

                data = this.filterData(data);

                this.filteredData = [...data];

                data = this.sortData(data);

                // Grab the page's slice of data.
                const startIndex = this._matPaginator.pageIndex * this._matPaginator.pageSize;
                return data.splice(startIndex, this._matPaginator.pageSize);
            })
        );

    }

    /**
     * Filter data
     *
     * @param data
     * @returns {any}
     */
    filterData(data): any
    {
        if ( !this.filter )
        {
            return data;
        }
        return FuseUtils.filterArrayByString(data, this.filter);
    }

    /**
     * Sort data
     *
     * @param data
     * @returns {any[]}
     */
    sortData(data): any[]
    {
        if ( !this._matSort.active || this._matSort.direction === '' )
        {
            return data;
        }

        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            switch ( this._matSort.active )
            {
                case 'id':
                    [propertyA, propertyB] = [a.id, b.id];
                    break;
                case 'reference':
                    [propertyA, propertyB] = [a.reference, b.reference];
                    break;
                case 'customer':
                    [propertyA, propertyB] = [a.customer.firstName, b.customer.firstName];
                    break;
                case 'total':
                    [propertyA, propertyB] = [a.total, b.total];
                    break;
                case 'payment':
                    [propertyA, propertyB] = [a.payment.method, b.payment.method];
                    break;
                case 'status':
                    [propertyA, propertyB] = [a.status[0].name, b.status[0].name];
                    break;
                case 'date':
                    [propertyA, propertyB] = [a.date, b.date];
                    break;
            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._matSort.direction === 'asc' ? 1 : -1);
        });
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}
@Component({
    selector: 'dialog-overview-example-dialog',
    templateUrl: 'dialog-overview-example-dialog.html',
  })
  export class DialogOverviewExampleDialog {
  
    constructor(
      public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    //   @Inject(MAT_DIALOG_DATA) public data: DialogData
      ) 
      {}
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
  }

  @Component({
    selector: 'mail-overview',
    templateUrl: 'mail-overview.html',
    styleUrls    : ['mail-overview.scss'],
  })
  export class MailOverview {
  
    constructor(
      public dialogRef: MatDialogRef<MailOverview>,
    //   @Inject(MAT_DIALOG_DATA) public data: DialogData
      ) 
      {}
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
  }

  