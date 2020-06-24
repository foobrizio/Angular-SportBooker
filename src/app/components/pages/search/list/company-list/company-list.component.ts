import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { List } from '../list';
import { Company } from 'src/app/classes/company';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css']
})
export class CompanyListComponent implements OnInit, OnChanges, List {

  @Input() companyList: Company[];
  @Input() companyQuantity: number;

  @Output() paginated: EventEmitter<object> = new EventEmitter<object>();
  pageIndex = 0;
  pageSize = 10;
  pageSizeOptions = [5, 10 , 20];

  constructor() { }

  ngOnInit(): void { }

  ngOnChanges(): void{ }


  setQuantity(qt: number): void {
    this.companyQuantity = qt;
  }

  setList(list: Company[]): void{

    // Noi riceviamo una lista di oggetti con le stesse caratteristiche di Company, ma per renderle effettivamente
    // istanze di Company, dobbiamo invocare il metodo factory della classe Company
    const newList: Company[] = [];
    list.forEach(company => {
      const c = Company.create(company);
      newList.push(c);
    });
    this.companyList = newList;
  }

  resetList(): void{

    this.companyQuantity = 0;
    this.companyList = [];
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
