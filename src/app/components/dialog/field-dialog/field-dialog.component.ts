import { Component, OnInit, Input, Inject } from '@angular/core';
import { Company } from 'src/app/classes/company';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Field } from 'src/app/classes/field';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  templateUrl: './field-dialog.component.html',
  styleUrls: ['./field-dialog.component.css']
})
export class FieldDialogComponent implements OnInit {

  companyList: Company[];

  created: Field;

  sportList = ['Calcio', 'Calcetto', 'Tennis', 'Volley', 'Basket', 'Rugby'];

  myForm = this.fb.group({

    company: ['', [Validators.required]],
    sport: ['', [Validators.required]],
    terrain: [''],
    length: ['', [Validators.pattern('^[0-9]*$')]],
    width: ['', [Validators.pattern('^[0-9]*$')]],
    cost: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(2)]]

  });


  constructor(public dialog: MatDialogRef<FieldDialogComponent>, @Inject(MAT_DIALOG_DATA) public data, private fb: FormBuilder) {

    this.companyList = data;
    this.companyList.forEach( comp => console.log(comp));
  }

  ngOnInit(): void {

  }

  onAnnullaClick(): void{

    this.dialog.close();
  }

  onCreaClick(): void{

    this.createFieldObject();
    this.dialog.close(this.created);
  }


  createFieldObject(): void{

    this.created = new Field();
    const rawField = this.myForm.value;
    Object.keys(rawField).forEach( key => {

      if (key === 'company'){
        const companyIndex = rawField[key];
        this.created.ownerCompany = this.companyList[companyIndex];
      }
      else{
        this.created[key] = rawField[key];
      }
    });

  }

}
