import { Component, OnInit, Input, Output } from '@angular/core';
import { SearchPageComponent } from '../../search/search-page/search-page.component';
import { SearchService } from 'src/app/services/search/search.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sport',
  templateUrl: './sport.component.html',
  styleUrls: ['./sport.component.css']
})
export class SportComponent implements OnInit {


  constructor(private searchService: SearchService) { }

  ngOnInit(){  }

}
