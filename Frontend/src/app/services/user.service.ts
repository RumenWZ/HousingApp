import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = "http://localhost:5131/api";

  constructor(
    private http: HttpClient,
    private router: Router) { }

  addUser(user: User) {
    return this.http.post(this.baseUrl + '/account/register', user);
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

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    this.router.navigate(['/']);
  }
}
