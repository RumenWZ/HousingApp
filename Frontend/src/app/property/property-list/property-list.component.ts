import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPropertyBase } from 'src/app/model/ipropertybase';
import { HousingService } from 'src/app/services/housing.service';


@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css']
})
export class PropertyListComponent implements OnInit{
  SellRent = 1;
  properties: Array<IPropertyBase>;
  city: '';
  searchCityFilter: '';
  sortByParam = 'City';
  sortDirection = 'asc';

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
      data=>{
        this.properties=data;


        console.log(data);
      }, error => {
        console.log(error);
      }
    );
  }
}
