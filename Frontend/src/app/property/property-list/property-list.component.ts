import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Property } from 'src/app/model/property';
import { HousingService } from 'src/app/services/housing.service';


@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition('void => *', animate('600ms')),
    ]),
  ]
})
export class PropertyListComponent implements OnInit{
  SellRent = 1;
  properties: Property[];
  city: '';
  searchCityFilter: '';
  sortByParam = 'City';
  sortDirection = 'asc';

  pageSize: number = 3;
  currentPage: number = 1;

  constructor(private housingService: HousingService, private route: ActivatedRoute) { }


  onSearchClick(){
    this.searchCityFilter = this.city;
  }

  onClearClick(){
    this.searchCityFilter = '';
    this.city = '';
  }

  toggleSortDirection(){
    if (this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    } else {
      this.sortDirection = 'asc';
    }
  }

  ngOnInit(): void {
    this.searchCityFilter = '';
    if (this.route.snapshot.url.toString()) {
      this.SellRent = 2;
    }
    this.housingService.getAllProperties(this.SellRent).subscribe(
      (response: any)=>{
        this.properties=response;
      }
    );
  }
}
