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

  // getProperty(id: number) {
  //   return this.getAllProperties().pipe(
  //     map(data => {
  //       return data.find(p => p.id === id);
  //     })
  //   )
  // }

  uploadPropertyPhotos(propertyId: number, photos: FormData) {
    return this.http.post(`${this.baseUrl}/property/add-photos/${propertyId}`, photos);
  }

  getPropertyDetails(id: number) {
    return this.http.get(`${this.baseUrl}/property/details/${id}`);
  }

  getAllProperties(sellRent?: number) {
    return this.http.get(`${this.baseUrl}/property/list/${sellRent}`);
  }

  addProperty(property: Property) {
    return this.http.post(`${this.baseUrl}/property/add-property`, property);
  }

  deleteProperty(id: number) {
    return this.http.delete(`${this.baseUrl}/property/delete/${id}`);
  }

}
