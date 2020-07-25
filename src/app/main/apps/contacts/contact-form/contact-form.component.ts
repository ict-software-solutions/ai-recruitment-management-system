import { CdkDragDrop, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { Component, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute } from '@angular/router';
import { Contact } from "app/main/apps/contacts/contact.model";
import { usertype } from "app/models/user-type";
import { AuthService } from "app/service/auth.service";
import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import Swal from "sweetalert2";


@Component({
  selector: "contacts-contact-form-dialog",
  templateUrl: "./contact-form.component.html",
  styleUrls: ["./contact-form.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ContactsContactFormDialogComponent {
  form: FormGroup;
  roleId:any;
  rolesDetails: any;
  selected1 = 'active';
   usertypes: usertype[] = [
    { value: "Active"},
    { value: "InActive" },
    { value: "Candidate"}
   ];
  totScreens = [
    {
      title: "Dashboard",
      icon: "dashboard",
    },
    {
      title: "Calendar",
      icon: "today",
    },
    {
      title: "User Management",
      icon: "person",
    },
    {
      title: "Edit Profile",
      icon: "edit",
    },
  ];
  todo = [];
  done = [];

  screens = ["dashboard", "Calander", "User Management", "Edit Profile"];
  status=[
    { value: "Activated"},
    { value: "Locked"},
  ]
  items = [];
  selectedItems: Item[];
  action: string;
  contact: Contact;
  contactForm: FormGroup;
  dialogTitle: string;
  labelPosition: "before" | "after" = "after";
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
  active:boolean;
  newRole=true;


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.todo=this.totScreens;
    const _data = this.route.snapshot.params;
    this.action = _data.action;
    if (this.action === "edit") {
      this.dialogTitle = "Edit Role";
      this.contact = _data.contact;
      
    } else {
      this.dialogTitle = "New Role";
      this.contact = new Contact({});
      this.newRole = false;
    }
    // this.contactForm = this.createContactForm();
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }
  ngOnInit() {
    this.contactForm = this.formBuilder.group({
      roleId: [""],
      roleName: [""],
      active:[""],
      roleDescription: [""]
    });
    this.route.queryParams.subscribe((params) => {

     if ((this.roleId=params["roleId"])){
        console.log(params);
      }
      this.getAllRolesInfo(Number(params.roleId));
    });
 
  }
  getAllRolesInfo(roleId) {
    console.log("roleID", roleId);
    this.authService.getAllRolesInfo(roleId).subscribe((res) => {
      this.rolesDetails = res;
      this.contactForm.patchValue(res);
    });
  }
  updateRole(value){
    let updateObject = {
      roleName: value.roleName,
      roleDescription: value.roleDescription,
      active: value.active,
      roleId:value.roleId
    };

    

    this.authService.updateRolesInfo(updateObject).subscribe(
      (res) => {
    //  alert("hi");
    Swal.fire({
      title: "Role Updated",
      icon: "success",
      confirmButtonText: "Ok",
    }).then((res) => {
      if (res.value === true) {
        this.canceledit();
        // this.enableEdit = false;
      }
    });
      },
    );
  }

  canceledit() {
    // this.viewMode = true;

    this.authService.getAllRolesInfo(this.roleId).subscribe((res) => {
      this.rolesDetails = res;
      this.form.patchValue(res);
    });
  }
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
  addScreen() {
    this.todo = [];
    this.done = [];
    this.done = this.totScreens;
  }
  removeScreen() {
    this.todo = [];
    this.done = [];
    this.todo = this.totScreens;
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
    if (this.selectedItems.map((x) => x.name).toString() === this.screens.toString()) {
      alert("They are in the same order");
    } else {
      alert("They have different order");
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
    this.toggle3 = !this.toggle3;
  }
  userManagement() {
    this.selectuser = !this.selectuser;
    this.toggle4 = !this.toggle4;
  }
  rolemanagement() {
    this.selectrole = !this.selectrole;
    this.toggle5 = !this.toggle5;
  }
  // createContactForm(): FormGroup {
  //   return this._formBuilder.group({
  //     id: [this.contact.id],
  //     name: [this.contact.name],
  //     lastName: [this.contact.lastName],
  //     avatar: [this.contact.avatar],
  //     nickname: [this.contact.nickname],
  //     company: [this.contact.company],
  //     jobTitle: [this.contact.jobTitle],
  //     email: [this.contact.email],
  //     phone: [this.contact.phone],
  //     address: [this.contact.address],
  //     birthday: [this.contact.birthday],
  //     notes: [this.contact.notes],
  //     rolename: [this.contact.rolename],
  //     desc: [this.contact.desc],
  //     status: [this.contact.status],
  //   });
  // }
}

interface Item {
  name: string;
  selected: boolean;
}
