import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject} from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';

import { orderStatuses } from 'app/main/apps/e-commerce/order/order-statuses';
import { Order } from 'app/main/apps/e-commerce/order/order.model';
import { EcommerceOrderService } from 'app/main/apps/e-commerce/order/order.service';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';


import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';

import { MailService } from 'app/main/apps/mail/mail.service';
import { MailComposeDialogComponent } from 'app/main/apps/mail/dialogs/compose/compose.component';
@Component({
    selector     : 'e-commerce-order',
    templateUrl  : './order.component.html',
    styleUrls    : ['./order.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class EcommerceOrderComponent implements OnInit, OnDestroy
{
    order: Order;
    orderStatuses: any;
    statusForm: FormGroup;
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    // dialogRef: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {EcommerceOrderService} _ecommerceOrderService
     * @param {FormBuilder} _formBuilder
     * @param {MatDialog} _matDialog
    //
     * /
     *  
     */
    constructor(
        private _ecommerceOrderService: EcommerceOrderService,
        private _formBuilder: FormBuilder,
        public _matDialog: MatDialog
       
    )
    {
        // Set the defaults
        this.order = new Order();
        this.orderStatuses = orderStatuses;

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
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Subscribe to update order on changes
        this._ecommerceOrderService.onOrderChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(order => {
                this.order = new Order(order);
            });

        this.statusForm = this._formBuilder.group({
            newStatus: ['']
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
    deleteContact(contact): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        // this.confirmDialogRef.afterClosed().subscribe(result => {
        //     if ( result )
        //     {
        //         this._contactsService.deleteContact(contact);
        //     }
        //     this.confirmDialogRef = null;
        // });

    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Update status
     */
    updateStatus(): void
    {
        const newStatusId = Number.parseInt(this.statusForm.get('newStatus').value);

        if ( !newStatusId )
        {
            return;
        }

        const newStatus = this.orderStatuses.find((status) => {
            return status.id === newStatusId;
        });

        newStatus['date'] = new Date().toString();

        this.order.status.unshift(newStatus);
    }


 
}
