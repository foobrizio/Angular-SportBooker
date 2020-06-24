import { Component, OnInit, OnChanges, Output, Input, EventEmitter } from '@angular/core';
import { List } from '../list';
import { Field } from 'src/app/classes/field';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-field-list',
  templateUrl: './field-list.component.html',
  styleUrls: ['./field-list.component.css']
})
export class FieldListComponent implements OnInit, OnChanges, List {

  @Input() fieldList: Field[];
  @Input() fieldQuantity: number;

  @Output() paginated: EventEmitter<object> = new EventEmitter<object>();
  pageIndex = 0;
  pageSize = 10;
  pageSizeOptions = [5, 10, 20];

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void{

  }

  setQuantity(qt: number): void{

    this.fieldQuantity = qt;
  }

  setList(list: Field[]): void{
    this.fieldList = list;
  }

  resetList(): void{
    this.fieldQuantity = 0;
    this.fieldList = [];
  }

  handlePage(e: PageEvent){

    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    const result = {
      pageNumber: this.pageIndex,
      pageSize: this.pageSize
    };
    this.paginated.emit(result);
  }

}
