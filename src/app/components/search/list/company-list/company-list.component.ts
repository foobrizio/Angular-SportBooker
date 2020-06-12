import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { List } from '../list';
import { Company } from 'src/app/classes/company';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css']
})
export class CompanyListComponent implements OnInit, OnChanges, List {

  @Input() companyList: Company[];

  constructor() { }

  ngOnInit(): void { }

  ngOnChanges(): void{ }

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

    this.companyList = [];
  }

}
