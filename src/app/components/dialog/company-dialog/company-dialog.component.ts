import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Company } from 'src/app/classes/company';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export class RequiredErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!( (control && control.invalid && control.touched) || (!control.touched && isSubmitted));
  }
}

@Component({
  templateUrl: './company-dialog.component.html',
  styleUrls: ['./company-dialog.component.css']
})
export class CompanyDialogComponent implements OnInit {

  created: Company;
  name: string;
  city: string;
  address: string;
  description: string;
  phone: string;
  email: string;
  freeDay: number;
  openingTime: number;
  closingTime: string;

  checked;

  daysOfWeek = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
  availableHours = ['08' , '09' , '10' , '11' , '12' , '13' , '14' , '15' , '16' , '17' , '18' , '19' , '20' , '21' , '22' , '23'];
  availableClosingHours = ['08' , '09' , '10' , '11' , '12' , '13' , '14' , '15' , '16' , '17' , '18' , '19' , '20' , '21' , '22' , '23'];

  emailFormControl = new FormControl('', [Validators.email]);

  phoneFormControl = new FormControl('', [Validators.required]);





  matcher = new MyErrorStateMatcher();
  requiredMatcher = new RequiredErrorStateMatcher();



  constructor(public dialogRef: MatDialogRef<CompanyDialogComponent>) { }

  ngOnInit(): void {

    this.created = new Company();
    this.checked = false;
  }


  updateHours(): void{

    this.availableClosingHours = this.availableHours;
    this.availableClosingHours = this.availableClosingHours.slice(this.openingTime + 1);
  }

  onAnnullaClick(): void{

    this.dialogRef.close();

  }

  onCreaClick(): void{

    if (this.checkValues()){
      this.createCompany();
      this.dialogRef.close();
    }
  }
  createCompany(){

    this.created.name = this.name;
    this.created.description = this.description;
    this.created.email = this.email;
    this.created.phone = this.phone;
    this.created.address = this.address;
    this.created.city = this.city;
    // tslint:disable-next-line: prefer-const
    let opTime = {hours: 0, minutes: 0};
    // tslint:disable-next-line: prefer-const
    let clTime = {hours: 0, minutes: 0};
    opTime.hours = Number.parseInt( this.availableHours[this.openingTime], 10);
    opTime.minutes = 0;
    clTime.hours = Number.parseInt( this.closingTime, 10);
    clTime.minutes = 0;
    this.created.openingTime = opTime;
    this.created.closingTime = clTime;
    this.created.freeDay = this.freeDay;
  }

  checkValues(): boolean{

    this.checked = true;
    let value = true;
    if (this.name === undefined){
      value = false;
    }
    if (this.phone === undefined || this.phone === ''){
      value = false;
    }
    if (this.address === undefined || this.address === ''){
      value = false;
    }
    if (this.city === undefined || this.city === ''){
      value = false;
    }
    if (this.openingTime === undefined){
      value = false;
    }
    if (this.closingTime === undefined){
      value = false;
    }
    console.log(value);
    return value;
  }

}
