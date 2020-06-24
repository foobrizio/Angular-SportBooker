import { Component, OnInit, ViewChild } from '@angular/core';
import { SearchService } from 'src/app/services/search/search.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FlexibleObject } from './flexible-object';
import { FieldListComponent } from '../list/field-list/field-list.component';
import { CompanyListComponent } from '../list/company-list/company-list.component';

@Component({
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit {

  lookingFor: string;
  sport: string;
  rating: number;
  terrain: string;
  city: string;
  date: Date;
  time: string;
  availableHours = ['08' , '09' , '10' , '11' , '12' , '13' , '14' , '15' , '16' , '17' , '18' , '19' , '20' , '21' , '22' , '23'];

  selectedSearch: string;
  selectedCity: string;
  selectedDate: Date;
  selectedTime: string;
  selectedTerrain: string;
  ratingFieldRadio: number;
  ratingCompanyRadio: number;

  pageIndex = 0;
  pageSize = 10;

  @ViewChild('fieldList') fieldList: FieldListComponent;
  @ViewChild('companyList') companyList: CompanyListComponent;


  // tslint:disable-next-line: max-line-length
  constructor(private searchService: SearchService, private activatedRoute: ActivatedRoute,  private router: Router, private location: Location) { }

  ngOnInit(): void {

    window.scrollTo(0 , 0);
    this.subscribeToParams();
    this.search();
  }

  getSelectedSearch(): string {

    return this.selectedSearch;
  }

  setSelectedSearch(selected: string): void{
    this.selectedSearch = selected;
  }

  prepareSearch(e: any){

    this.pageIndex = e.pageNumber;
    this.pageSize = e.pageSize;
    this.search();
  }

  search(): void{

    let myParams = this.createParams();
    // questo serve per cancellare l'oggetto myParams dopo il suo utilizzo, così da ricrearlo pulito dopo
    this.searchService.setParams(myParams);
    this.searchService.search();
    let newUrl = 'search';
    if (Object.keys(myParams).length > 0){
      newUrl = newUrl.concat('?');
      Object.keys(myParams).forEach( key => {
        newUrl = newUrl.concat(key, '=', myParams[key], '&');
      });
    }
    newUrl = newUrl.substring(0, newUrl.length - 1);
    this.router.navigateByUrl(newUrl);
    // this.location.go()
    // this.ngOnInit();+
    // this.lookingFor = myParams.lookingFor;
    console.log('lookingFor=' + this.lookingFor);
    if (myParams.lookingFor === 'fields'){
      this.searchFields();
    } // fields
    else{
      this.searchCompanies();
    }
    window.scrollTo(0, 0);
    myParams = null;
  }


  searchFields(): void {

    this.searchService.getFieldsQuantity().subscribe({
      next: x => {
        this.fieldList.setQuantity(x);
      }
    });
    this.searchService.getFields(this.pageIndex, this.pageSize).subscribe({
      next: x => {
        const message: any = x;
        if (message.message === 'No results!!!'){
          console.log('Nessun campo ricevuto');
          this.fieldList?.resetList();
        }
        else{
          this.fieldList?.setList(x);
        }
      },
      error: err => {
        console.log('Observer ha generato l\'errore ');
        console.log(err);
      }
    });
  }


  searchCompanies(): void {

    this.searchService.getCompaniesQuantity().subscribe({
      next: x => {
        this.companyList.setQuantity(x);
      }
    });
    this.searchService.getCompanies(this.pageIndex, this.pageSize).subscribe({
      next: x => {
        const message: any = x;
        if (message.message === 'No results!!!'){
          this.companyList?.resetList();
        }
        else{
          this.companyList?.setList(x);
        }
      },
      error: err => {
        console.log('Observer ha generato l\'errore ');
        console.log(err);
      }
    });
  }
  /* Questo metodo controlla costantemente la variazione dei parametri dell'url,
     andando ad aggiornare quelli presenti nel nostro component */
  subscribeToParams(): void{

    this.activatedRoute.queryParams.subscribe( params => {
      this.lookingFor = params.lookingFor;
      this.selectedSearch = params.lookingFor;
      this.sport = params.sport;
      this.terrain = params.terrain;
      this.rating = params.rating;
      this.city = params.city;
      this.date = params.date;
      this.time = params.time;
      console.log(params);
      this.ratingFieldRadio = params.rating;
      this.ratingCompanyRadio = params.rating;
    });

  }



  private createParams(): FlexibleObject {

    const myParams: FlexibleObject = {
      lookingFor : this.selectedSearch,
    };
    if ( this.selectedSearch === 'fields'){
      if (this.sport){
        myParams.sport = this.sport;
      }
      myParams.rating = this.ratingFieldRadio;
      if ( this.selectedCity){
        myParams.city = this.selectedCity;
      }
      if ( this.selectedTerrain){
        myParams.terrain = this.selectedTerrain;
      }
      if ( this.selectedDate){
        myParams.date = this.selectedDate;
      }
      if ( this.selectedTime){
        myParams.time = this.selectedTime;
      }
    }// fields
    else {
      if ( this.selectedCity){
        myParams.city = this.selectedCity;
      }
      myParams.rating = this.ratingCompanyRadio;
    } // companies
    return myParams;
  }
}
