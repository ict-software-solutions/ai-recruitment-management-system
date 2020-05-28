import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
// import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { ContactsService } from 'app/main/apps/contacts/contacts.service';
import { ContactsContactFormDialogComponent } from 'app/main/apps/contacts/contact-form/contact-form.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MailService } from 'app/main/apps/mail/mail.service';
import { MailComposeDialogComponent } from 'app/main/apps/mail/dialogs/compose/compose.component';
import { ContactDialogComponent } from '../contact-dialog/contact-dialog.component';
// import { ContactDeleteComponent } from '../contact-delete/contact-delete.component';
// import {MatExpansionModule} from '@angular/material/expansion';


export interface DialogData {
    animal: string;
    name: string;
  }
@Component({
    selector     : 'contacts-contact-list',
    templateUrl  : './contact-list.component.html',
    styleUrls    : ['./contact-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ContactsContactListComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;

    contacts: any;
    user: any;
    dataSource: FilesDataSource | null;s
    displayedColumns = [ 'x','name','mob','company','vacancies','mapped','active'];
    selectedContacts: any[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;
    name: any;
    animal: any;
    /**
     * Constructor
     *
     * @param {ContactsService} _contactsService
     * @param {MatDialog} _matDialog
     * @param {FormBuilder} _formBuilder
     * 
     */

    // public dialog: MatDialog,
    constructor(public dialog:MatDialog,
        private _contactsService: ContactsService,
        // public _matDialog: MatDialog,
        private _formBuilder: FormBuilder
        
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    mappedCandidates(): void
    {
        // alert("hi");
        this.dialogRef = this.dialog.open(ContactDialogComponent, {
            // panelClass: 'mail-compose-dialog'
        });
        // this.dialogRef.afterClosed()
        //     .subscribe(response => {
        //         if ( !response )
        //         {
        //             return;
        //         }
        //         const actionType: string = response[0];
        //         const formData: FormGroup = response[1];
        //         switch ( actionType )
        //         {
                    /**
                     * Send
                     */
                    // case 'send':
                    //     console.log('new Mail', formData.getRawValue());
                    //     break;
                    /**
                     * Delete
                     */
                    // case 'delete':
                    //     console.log('delete Mail');
                    //     break;
            //     }
            // }
            // );
    }
    // openDelete(): void {
    //     const dialogRef = this.dialog.open(ContactDeleteComponent, {
    //       width: '250px',
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

    // openDialog(): void {
    //     const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
    //       width: '400px',
    //       height:'800px',
    //       data: {name: this.name, animal: this.animal}
    //     });
    
    //     dialogRef.afterClosed().subscribe(result => {
    //       console.log('The dialog was closed');
    //       this.animal = result;
    //     });
    //   }


    ngOnInit(): void
    {
        this.dataSource = new FilesDataSource(this._contactsService);

        this._contactsService.onContactsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(contacts => {
                this.contacts = contacts;

                this.checkboxes = {};
                contacts.map(contact => {
                    this.checkboxes[contact.id] = false;
                });
            });

        this._contactsService.onSelectedContactsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedContacts => {
                for ( const id in this.checkboxes )
                {
                    if ( !this.checkboxes.hasOwnProperty(id) )
                    {
                        continue;
                    }

                    this.checkboxes[id] = selectedContacts.includes(id);
                }
                this.selectedContacts = selectedContacts;
            });

        this._contactsService.onUserDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            });

        this._contactsService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._contactsService.deselectContacts();
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
     * Edit contact
     *
     * @param contact
     */
    editContact(contact): void
    {
        this.dialogRef = this.dialog.open(ContactsContactFormDialogComponent, {
            panelClass: 'contact-form-dialog',
            data      : {
                contact: contact,
                action : 'edit'
            }
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
                     * Save
                     */
                    case 'save':

                        this._contactsService.updateContact(formData.getRawValue());

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        this.deleteContact(contact);

                        break;
                }
            });
    }

    /**
     * Delete Contact
     */
    deleteContact(contact): void
    {
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._contactsService.deleteContact(contact);
            }
            this.confirmDialogRef = null;
        });

    }

    /**
     * On selected change
     *
     * @param contactId
     */
    onSelectedChange(contactId): void
    {
        this._contactsService.toggleSelectedContact(contactId);
    }

    /**
     * Toggle star
     *
     * @param contactId
     */
    toggleStar(contactId): void
    {
        if ( this.user.starred.includes(contactId) )
        {
            this.user.starred.splice(this.user.starred.indexOf(contactId), 1);
        }
        else
        {
            this.user.starred.push(contactId);
        }

        this._contactsService.updateUserData(this.user);
    }
}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {ContactsService} _contactsService
     */
    constructor(
        private _contactsService: ContactsService
    )
    {
        super();
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]>
    {
        return this._contactsService.onContactsChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}
// @Component({
//     selector: 'contact-delete-component',
//     templateUrl: 'contact-delete-component.html',
//   })
//   export class MailOverview {
  
//     constructor(
//       public dialogRef: MatDialogRef<ContactDeleteComponent>,
    
//       ) 
//       {}
  
//     onNoClick(): void {
//       this.dialogRef.close();
//     }
  
//   }



  
  
