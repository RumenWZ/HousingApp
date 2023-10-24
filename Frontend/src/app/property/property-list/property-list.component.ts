import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Property } from 'src/app/model/property';
import { HousingService } from 'src/app/services/housing.service';


@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css']
})
export class PropertyListComponent implements OnInit{
  SellRent = 1;
  properties: Property[];
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

  test() {
    console.log(this.city);
    console.log(this.sortByParam);
  }

  ngOnInit(): void {
    this.searchCityFilter = '';
    if (this.route.snapshot.url.toString()) {
      this.SellRent = 2;
    }
    this.housingService.getAllProperties(this.SellRent).subscribe(
      (response: any)=>{
        this.properties=response;

        console.log(response);
      }, error => {
        console.log(error);
      }
    );
  }
}
