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
    
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    this.router.navigate(['/']);
  }
}
