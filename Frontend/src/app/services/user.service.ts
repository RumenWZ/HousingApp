import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router) { }

  addUser(user: User) {
    return this.http.post(this.baseUrl + '/account/register', user);
  }

  getLoggedInUser() {
    return this.http.get(`${this.baseUrl}/account/user`);
  }

  getLoggedInUserDetails() {
    return this.http.get(`${this.baseUrl}/account/profile-details`);
  }

  getUserContactDetails(id: number) {
    return this.http.get(`${this.baseUrl}/account/user-contact-details/${id}`);
  }

  updateEmail(email: string) {
    return this.http.patch(`${this.baseUrl}/account/update-email/${email}`, null);
  }

  updateMobile(mobile: string) {
    return this.http.patch(`${this.baseUrl}/account/update-mobile/${mobile}`, null);
  }

  changePassword(formData: any) {
    return this.http.patch(`${this.baseUrl}/account/change-password`, formData);
  }

  getUserPropertiesCount() {
    return this.http.get<number>(`${this.baseUrl}/account/user-properties-count`);
  }

  checkIfLoggedIn() {
    return this.http.get(`${this.baseUrl}/account/check-logged-in`);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    this.router.navigate(['/']);
  }
}
