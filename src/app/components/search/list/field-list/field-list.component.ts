import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { List } from '../list';
import { Field } from 'src/app/classes/field';

@Component({
  selector: 'app-field-list',
  templateUrl: './field-list.component.html',
  styleUrls: ['./field-list.component.css']
})
export class FieldListComponent implements OnInit, OnChanges, List {


  pageSize = 10;
  pageSizeOptions = [5, 10, 20];

  @Input() fieldList: Field[];

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void{

  }

  setList(list: Field[]): void{
    this.fieldList = list;
  }

  resetList(): void{
    this.fieldList = [];
  }

}
