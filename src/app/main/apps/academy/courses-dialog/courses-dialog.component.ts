// import { Component, OnInit } from '@angular/core';

import {  OnInit } from '@angular/core';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-courses-dialog',
  templateUrl: './courses-dialog.component.html',
  styleUrls: ['./courses-dialog.component.scss']
})
export class CoursesDialogComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
