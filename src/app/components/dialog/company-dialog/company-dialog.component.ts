import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Company } from 'src/app/classes/company';
import { Validators,  FormBuilder } from '@angular/forms';
import { Time } from '@angular/common';


@Component({
  templateUrl: './company-dialog.component.html',
  styleUrls: ['./company-dialog.component.css']
})
export class CompanyDialogComponent implements OnInit {


  created: Company;

  myForm = this.fb.group({
    name: ['', [Validators.required]],
    description: [''],
    email: ['', [Validators.email]],
    address: ['', [Validators.required]],
    phone: ['',
    [Validators.required, Validators.minLength(9), Validators.maxLength(12)]],
    city: ['', [Validators.required]],
    freeDay: [''],
    openingTime: ['', [Validators.required]],
    closingTime: ['', [Validators.required]]
  });

  openingIndex: number;

  daysOfWeek = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
  availableHours = ['08' , '09' , '10' , '11' , '12' , '13' , '14' , '15' , '16' , '17' , '18' , '19' , '20' , '21' , '22' , '23'];
  availableClosingHours = ['08' , '09' , '10' , '11' , '12' , '13' , '14' , '15' , '16' , '17' , '18' , '19' , '20' , '21' , '22' , '23'];

  mode: string;

  constructor(public dialogRef: MatDialogRef<CompanyDialogComponent>, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data) {

    this.mode = data.mode;


  }

  ngOnInit(): void {

    this.created = new Company();
    if (this.mode === 'edit'){
      this.setCompany(this.data.company);
    }
  }

  setCompany(company: Company){

    this.openingIndex = this.availableHours.indexOf(String(company.openingTime).substring(0, 2));
    this.myForm.setValue({

      name: company.name,
      description: company.description,
      email: company.email,
      phone: company.phone,
      address: company.address,
      city: company.city,
      freeDay: company.freeDay,
      openingTime: this.availableHours.indexOf(String(company.openingTime).substring(0, 2)),
      closingTime: String(company.closingTime).substring(0, 2)
    });



  }


  updateHours(): void{

    this.availableClosingHours = this.availableHours;
    this.availableClosingHours = this.availableClosingHours.slice(this.openingIndex + 1);
  }

  onAnnullaClick(): void{

    this.dialogRef.close();

  }

  onCreaClick(): void{

    this.createCompanyObject();
    this.dialogRef.close(this.created);
  }

  createCompanyObject(): void{

    const rawCompany = this.myForm.value;
    Object.keys(rawCompany).forEach( key => {

      if (key === 'freeDay'){
        this.created.freeDay = Number.parseInt(rawCompany[key], 10);
      }
      else if (key === 'openingTime'){
        const opHour = Number.parseInt(this.availableHours[this.openingIndex], 10);
        const opTime: Time =  {hours: opHour, minutes: 0};
        this.created.openingTime = opTime;
      }
      else if (key === 'closingTime'){
        const clHour = Number.parseInt(rawCompany[key], 10);
        const clTime: Time = {hours: clHour, minutes: 0};
        this.created.closingTime = clTime;
      }
      else{
        this.created[key] = rawCompany[key];
      }
    });
  }

}
