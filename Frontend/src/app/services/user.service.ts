import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = "http://localhost:5131/api";

  constructor(private http: HttpClient) { }

  addUser(user: User) {
    return this.http.post(this.baseUrl + '/account/register', user);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
  }
}
