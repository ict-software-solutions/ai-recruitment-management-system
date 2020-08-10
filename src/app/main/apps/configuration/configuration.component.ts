import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import Swal from "sweetalert2";
import { AirmsService } from 'app/service/airms.service';
import { LOG_MESSAGES, LOG_LEVELS } from 'app/util/constants';
import { LogService } from 'app/service/shared/log.service';
export interface DialogData {
}
export interface Element {
  name: string;
  screenUsed: string;
  function: string;
  value: string
  action: string;
}
const ELEMENT_DATA: Element[] = [
  { name: 'Captcha', screenUsed: 'Login', function: 'Count', value: '2', action: '', },
  { name: 'Password Attempts', screenUsed: 'Login', function: 'Count', value: '5', action: '' }
];
@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  displayedColumns: string[] = ['name', 'screenUsed', 'function', 'value', 'action'];
  dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
  showReset = false;
  roleName: string;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(
    public dialog: MatDialog, private airmsService: AirmsService, private logService: LogService
  ) { 
    this.roleName = airmsService.getUserRole();
    this.logUserActivity("Configuration", LOG_MESSAGES.CLICK);
  }
  openDialog(element, type): void {
    console.log("element", element)
    if (element === undefined) {
      element = {}
    }
    element.type = type;
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '300px',
      data: element,
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  ngOnInit(): void {
  }
  logUserActivity(from, value) {
    this.logService.logUserActivity(LOG_LEVELS.INFO, from, value);
  }

}
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {
  showDialogData = false;
  displayData: any;
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    console.log("data", data);
    this.displayData = data;
  }
  cancel(): void {
    this.dialogRef.close();
  }
  submit() {
    if (this.displayData.type !== 'resetall') {
      this.showDialogData = true;
    }
    else {
      this.dialogRef.close();
      Swal.fire({
        position: "center",
        icon: 'success',
        title: 'Saved',
        showConfirmButton: false,
        timer: 1500
      });
    }
  }
  save(): void {
    this.dialogRef.close();
    Swal.fire({
      position: "center",
      icon: 'success',
      title: 'Your Changes has been saved',
      showConfirmButton: false,
      timer: 1500
    });
  }
}