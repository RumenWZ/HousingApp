import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BasicPropertyOption, Property } from '../model/property';

@Injectable({
  providedIn: 'root'
})
export class HousingService {
  baseUrl = 'http://localhost:5131/api';

  constructor(private http:HttpClient) { }

  getAllCities(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/city`);
  }

  getPropertyTypes() {
    return this.http.get<BasicPropertyOption[]>(`${this.baseUrl}/PropertyType`);
  }

  getFurnishingTypes() {
    return this.http.get<BasicPropertyOption[]>(`${this.baseUrl}/FurnishingType`);
  }

  getProperty(id: number) {
    return this.getAllProperties().pipe(
      map(data => {
        return data.find(p => p.id === id);
      })
    )
  }

  getAllProperties(SellOrRent?: number): Observable<Property[]> {
    return this.http.get<Property[]>(`${this.baseUrl}/property`);

    // return this.http.get('data/properties.json').pipe(
    //   map(data => {
    //     const propertiesArray: Array<any> = [];
    //     const localProperties = JSON.parse(localStorage.getItem('newProp'));
    //     if (localProperties) {
    //       for (const id in localProperties) {
    //         if(SellOrRent) {
    //         if (localProperties.hasOwnProperty(id) && localProperties[id].SellOrRent === SellOrRent) {
    //           propertiesArray.push(localProperties[id]);
    //         }
    //       } else {
    //         propertiesArray.push(localProperties[id]);
    //       }
    //       }
    //     }

    //     for (const id in data) {
    //       if (SellOrRent) {
    //       if (data.hasOwnProperty(id) && data[id].SellOrRent === SellOrRent) {
    //         propertiesArray.push(data[id]);
    //       }
    //     } else {
    //       propertiesArray.push(data[id]);
    //     }
    //     }
    //     return propertiesArray;
    //   })
    //return this.http.get<Property[]>('data/properties.json');
  }

  addProperty(property: Property) {
    return this.http.post(`${this.baseUrl}/property/add-property`, property);
  }

}
