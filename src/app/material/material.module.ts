import { NgModule } from '@angular/core';

import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';

import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';

import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';


import {MatMenuModule} from '@angular/material/menu';
import {MatDialogModule} from '@angular/material/dialog';
import {MatPaginatorModule} from '@angular/material/paginator';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';




const homeComponents = [ MatButtonModule, MatToolbarModule, MatIconModule, MatListModule, MatCardModule, MatDividerModule];
const searchComponents1 = [ MatInputModule, MatFormFieldModule, MatSelectModule, MatRadioModule, MatCheckboxModule];
const dateComponents = [ MatDatepickerModule, MatNativeDateModule];
const dialogComponents = [ MatDialogModule, FormsModule, ReactiveFormsModule];
const classComponents = [ MatMenuModule, MatPaginatorModule];

@NgModule({
  imports: [homeComponents, searchComponents1, dateComponents, dialogComponents, classComponents],
  exports: [homeComponents, searchComponents1, dateComponents, dialogComponents, classComponents]
})
export class MaterialModule { }
