import { Component, OnInit, Input, Inject } from '@angular/core';
import { Company } from 'src/app/classes/company';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Field } from 'src/app/classes/field';

@Component({
  templateUrl: './field-dialog.component.html',
  styleUrls: ['./field-dialog.component.css']
})
export class FieldDialogComponent implements OnInit {

  comp: Company[];
  sport: string;
  terrain: string;
  length: number;
  width: number;
  cost: number;


  constructor(public dialog: MatDialogRef<FieldDialogComponent>, @Inject(MAT_DIALOG_DATA) public companyList: Company[]) { }

  ngOnInit(): void {

  }

  onAnnullaClick(): void{

    this.dialog.close();
  }

  onCreaClick(): void{

    this.dialog.close();
  }

}
