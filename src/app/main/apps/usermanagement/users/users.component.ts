import { DataSource } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseUtils } from '@fuse/utils';
import { UserManagementService } from 'app/main/apps/usermanagement/users/users.service';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { userDetails } from 'app/models/user-details';
import { AuthService } from 'app/service/auth.service';

@Component({
    selector: 'e-commerce-products',
    templateUrl: './users.component.html',
    styleUrls: ['./products.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})

export class EcommerceProductsComponent implements OnInit, OnDestroy {

    dataSource: FilesDataSource | null;
    displayedColumns = ['image', 'firstName', 'lastName', 'userType', 'userRole', 'action'];
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild('filter', { static: true }) filter: ElementRef;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    private unsubscribeAll: Subject<any>;
    user:userDetails;
    usersDetails: any;


    constructor(
        public dialog: MatDialog,
        private authService: AuthService,
        private userManagementService: UserManagementService,
        public matDialog: MatDialog) {
        this.unsubscribeAll = new Subject();
        
    }

    ngOnInit(): void {
        this.dataSource = new FilesDataSource(this.userManagementService, this.paginator, this.sort);
        fromEvent(this.filter.nativeElement, 'keyup').pipe(
            takeUntil(this.unsubscribeAll),
            debounceTime(150),
            distinctUntilChanged()
        ).subscribe(() => {
            if (!this.dataSource) { return; }
            this.dataSource.filter = this.filter.nativeElement.value;
        });
        this.getAllUsers();
    }

    deleteContact(): void {
        this.confirmDialogRef = this.matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
        this.confirmDialogRef.afterClosed().subscribe(() => {
            this.confirmDialogRef = null;
        });
    }
    getAllUsers() {
        this.authService.getAllUsers(this.user).subscribe(res => {
            this.usersDetails = res
            console.log("result",res);
            // this.products-table.patchValue(res);
        })
    }

    ngOnDestroy() {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
        this.dataSource = null;
        this.displayedColumns = null;
        this.paginator = null;
        this.sort == null;
        this.filter = null;
        this.confirmDialogRef = null;
        this.dialog = null;
        this.userManagementService = null;
        this.matDialog = null;
    }
}

export class FilesDataSource extends DataSource<any>
{
    private _filterChange = new BehaviorSubject('');
    private _filteredDataChange = new BehaviorSubject('');

    /**
     * Constructor
     *
     * @param {UserManagementService} _ecommerceProductsService
     * @param {MatPaginator} _matPaginator
     * @param {MatSort} _matSort
     */
    constructor(
        private ecommerceProductsService: UserManagementService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort
    ) {
        super();

        this.filteredData = this.ecommerceProductsService.products;
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     *
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]> {
        const displayDataChanges = [
            this.ecommerceProductsService.onProductsChanged,
            this._matPaginator.page,
            this._filterChange,
            this._matSort.sortChange
        ];

        return merge(...displayDataChanges)
            .pipe(
                map(() => {
                    let data = this.ecommerceProductsService.products.slice();

                    data = this.filterData(data);

                    this.filteredData = [...data];

                    data = this.sortData(data);

                    // Grab the page's slice of data.
                    const startIndex = this._matPaginator.pageIndex * this._matPaginator.pageSize;
                    return data.splice(startIndex, this._matPaginator.pageSize);
                }
                ));
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    // Filtered data
    get filteredData(): any {
        return this._filteredDataChange.value;
    }

    set filteredData(value: any) {
        this._filteredDataChange.next(value);
    }

    // Filter
    get filter(): string {
        return this._filterChange.value;
    }

    set filter(filter: string) {
        this._filterChange.next(filter);
    }

    filterData(data): any {
        if (!this.filter) {
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
    sortData(data): any[] {
        if (!this._matSort.active || this._matSort.direction === '') {
            return data;
        }

        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            switch (this._matSort.active) {
                case 'id':
                    [propertyA, propertyB] = [a.id, b.id];
                    break;
                case 'username':
                    [propertyA, propertyB] = [a.username, b.username];
                    break;
                case 'categories':
                    [propertyA, propertyB] = [a.categories[0], b.categories[0]];
                    break;
                case 'price':
                    [propertyA, propertyB] = [a.priceTaxIncl, b.priceTaxIncl];
                    break;
                case 'quantity':
                    [propertyA, propertyB] = [a.quantity, b.quantity];
                    break;
                case 'active':
                    [propertyA, propertyB] = [a.active, b.active];
                    break;
            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._matSort.direction === 'asc' ? 1 : -1);
        });
    }
    disconnect(): void {
    }
}
