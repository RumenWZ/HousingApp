import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BasicPropertyOption,  Property } from '../model/property';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HousingService {
  baseUrl = environment.apiUrl;

  deletePropertyEmitter: EventEmitter<number> = new EventEmitter<number>();

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

  uploadPropertyPhotos(propertyId: number, photos: FormData) {
    return this.http.post(`${this.baseUrl}/property/add-photos/${propertyId}`, photos);
  }

  getPropertyDetails(id: number) {
    return this.http.get(`${this.baseUrl}/property/details/${id}`);
  }

  getFullPropertyDetails(id: number) {
    return this.http.get(`${this.baseUrl}/property/full-details/${id}`);
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

  updatePropertyDetails(id: number, data: Property) {
    return this.http.patch(`${this.baseUrl}/property/update-details/${id}`, data);
  }

  updatePhotoIndex(propId: number, photoId: number, index: number) {
    return this.http.patch(`${this.baseUrl}/property/update-photo-index/${propId}/${photoId}/${index}`, null);
  }

  uploadPropertyPhoto(propId: number, index: number, photo: any) {
    return this.http.post(`${this.baseUrl}/property/upload-photo/${propId}/${index}`, photo);
  }

  deletePropertyPhoto(propId: number, photoId: number) {
    return this.http.delete(`${this.baseUrl}/property/delete-photo/${propId}/${photoId}`);
  }
}
