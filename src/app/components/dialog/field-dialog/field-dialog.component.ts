import { Component, OnInit, Input, Inject } from '@angular/core';
import { Company } from 'src/app/classes/company';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Field } from 'src/app/classes/field';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  templateUrl: './field-dialog.component.html',
  styleUrls: ['./field-dialog.component.css']
})
export class FieldDialogComponent implements OnInit {

  companyList: Company[];
  created: Field;

  mode: string;
  from: string;

  sportList = ['Calcio', 'Calcetto', 'Tennis', 'Volley', 'Basket', 'Rugby'];

  selectedCompany: number;
  selectedSport: string;
  selectedTerrain: string;
  selectedLength: number;
  selectedWidth: number;
  selectedCost: number;

  myForm = this.fb.group({

    company: ['', [Validators.required]],
    sport: ['', [Validators.required]],
    terrain: [''],
    length: ['', [Validators.pattern('^[0-9]*$')]],
    width: ['', [Validators.pattern('^[0-9]*$')]],
    cost: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(2)]]

  });


  constructor(public dialog: MatDialogRef<FieldDialogComponent>, @Inject(MAT_DIALOG_DATA) public data, private fb: FormBuilder) {

    this.mode = data.mode;
    this.companyList = data.companyList;
  }

  ngOnInit(): void {

    console.log('Lista strutture:');
    console.log(this.data.companyList);
    this.from = this.data.from;
    if (this.mode === 'edit'){
      this.initEditField();
    }
    else{
      this.selectedCompany = 0;
    }
  }

  initEditField(){

    const field = Field.create(this.data.field);
    this.created = field;
    this.companyList = [];
    this.companyList.push(field.ownerCompany);
    this.selectedCompany = 0;
    this.selectedSport = field.sport;
    this.selectedTerrain = field.terrain;
    this.selectedLength = field.length;
    this.selectedWidth = field.width;
    this.selectedCost = field.cost;
  }

  onAnnullaClick(): void{

    this.dialog.close();
  }

  onCreaClick(): void{

    this.createFieldObject();
    this.dialog.close(this.created);
  }


  createFieldObject(): void{

    let id = 0;
    if (this.mode === 'edit'){
      id = this.created.id;
    }
    this.created = new Field();
    if (this.mode === 'edit'){
      this.created.id = id;
    }
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
