import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Contact } from 'app/main/apps/contacts/contact.model';
import { usertype } from 'app/models/user-type';
@Component({
  selector: 'contacts-contact-form-dialog',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ContactsContactFormDialogComponent {
  screens = ["dashboard", "Calander", "User Management", "Edit Profile"];
  status: usertype[] = [
    { value: 'employee-0', viewValue: 'Activated' },
    { value: 'client-1', viewValue: 'Locked' }
  ];
  items = [];
  selectedItems: Item[];
  action: string;
  contact: Contact;
  contactForm: FormGroup;
  dialogTitle: string;
  labelPosition: 'before' | 'after' = 'after';
  selected = false;
  selectdash = false;
  selectcal = false;
  selectpro = false;
  selectuser = false;
  selectrole = false;
  toggle1 = true;
  toggle2 = true;
  toggle3 = true;
  toggle4 = true;
  toggle5 = true;

  constructor(
    public matDialogRef: MatDialogRef<ContactsContactFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder) {
    this.action = _data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Role';
      this.contact = _data.contact;
    } else {
      this.dialogTitle = 'New Role';
      this.contact = new Contact({});
    }
    this.contactForm = this.createContactForm();
  }

  ngOnInit() { }

  select(value: any) {
    this.items.push(value);
  }

  unselect(item: any) {
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

  selectdashboard() {
    this.selectdash = !this.selectdash;
    this.toggle1 = !this.toggle1;
    // this.status = this.toggle ? 'Enable' : 'Disable';
  }
  selectcalander() {
    this.selectcal = !this.selectcal;
    this.toggle2 = !this.toggle2;
  }
  selectProfile() {
    this.selectpro = !this.selectpro;
    this.toggle3= !this.toggle3;
  }
  userManagement() {
    this.selectuser = !this.selectuser;
    this.toggle4= !this.toggle4;
  }
  rolemanagement() {
    this.selectrole = !this.selectrole;
    this.toggle5= !this.toggle5;
  }
  createContactForm(): FormGroup {
    return this._formBuilder.group({
      id: [this.contact.id],
      name: [this.contact.name],
      lastName: [this.contact.lastName],
      avatar: [this.contact.avatar],
      nickname: [this.contact.nickname], company: [this.contact.company],
      jobTitle: [this.contact.jobTitle],
      email: [this.contact.email],
      phone: [this.contact.phone],
      address: [this.contact.address],
      birthday: [this.contact.birthday],
      notes: [this.contact.notes],
      rolename: [this.contact.rolename],
      desc: [this.contact.desc],
      status: [this.contact.status],
    });
  }
}
interface Item {
  name: string;
  selected: boolean;
}