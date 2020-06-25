import { Component, Inject, ViewEncapsulation,VERSION } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Contact } from 'app/main/apps/contacts/contact.model';
interface usertype {
    value: string;
    viewValue: string;
  }
@Component({
    selector     : 'contacts-contact-form-dialog',
    templateUrl  : './contact-form.component.html',
    styleUrls    : ['./contact-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ContactsContactFormDialogComponent
{
    screens = [
        "dashboard",
        "Calander",
        "User Management",
        "Edit Profile"];

        items= [];
  selectedItems: Item[];
 
    action: string;
    contact: Contact;
    contactForm: FormGroup;
    dialogTitle: string;
    // typesOfScreens: string[] = ['Dashboard', 'calender','Edit Profile', 'User Management', 'Role Management'];
    // typesOfConfscreens: string[] = ['Dashboard','User Management', 'Role Management'];
    // selectedValue: string;
    labelPosition: 'before' | 'after' = 'after';
    
    /**
     * Constructor
     *
     * @param {MatDialogRef<ContactsContactFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<ContactsContactFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder
    )
    {
        // Set the defaults
        this.action = _data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Edit Role';
            this.contact = _data.contact;
        }
        else
        {
            this.dialogTitle = 'New Role';
            this.contact = new Contact({});
        }

        this.contactForm = this.createContactForm();
    }
    ngOnInit() {
        // this.newGame();
      }
    //   newGame() {
    //     this.items = this.shuffleArray(this.screens.slice())
    //       .map(x => ({ name: x, selected: false }));
    //     this.selectedItems = [];
    //   }
      select(value:any) {
          console.log("selectvalue",value);
        // if (item.selected) {
        //   return;
        
  
        this.items.push(value);
        console.log("selectitems",this.items);
        // item.selected = true;
    
        // if (this.selectedItems.length === this.screens.length) {
        //   this.compareResult();
        // }
      }
      unselect(item: any) {
        console.log("selectvalue",item);

        // if (item.selected) {
        //   return;
        // }
  
        this.screens.push(item);
        item.selected = true;
    
        if (this.selectedItems.length === this.screens.length) {
          this.compareResult();
        }
      }
      shuffleArray(arr) {
        for (let c = arr.length - 1; c > 0; c--) {
          let b = Math.floor(Math.random() * (c + 1));
          let a = arr[c];
          arr[c] = arr[b];
          arr[b] = a;
        }
        return arr;
      }
      compareResult() {
        if (this.selectedItems.map(x => x.name).toString() === this.screens.toString()) {
          alert('They are in the same order')
        } else {
          alert('They have different order')
        }
      }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create contact form
     *
     * @returns {FormGroup}
     */
    createContactForm(): FormGroup
    {
        return this._formBuilder.group({
            id      : [this.contact.id],
            name    : [this.contact.name],
            lastName: [this.contact.lastName],
            avatar  : [this.contact.avatar],
            nickname: [this.contact.nickname],
            company : [this.contact.company],
            jobTitle: [this.contact.jobTitle],
            email   : [this.contact.email],
            phone   : [this.contact.phone],
            address : [this.contact.address],
            birthday: [this.contact.birthday],
            notes   : [this.contact.notes],
            rolename   : [this.contact.rolename],
            desc  : [this.contact.desc],
            status  : [this.contact.status],
            food:[this.contact.food]
        });
    }
}
interface Item {
    name: string;
    selected: boolean;
  }