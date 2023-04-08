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
    console.log(user);
    
    return this.http.post(this.baseUrl + '/account/register', user);

    // let users = [];
    // if (localStorage.getItem('Users')) {
    //   users = JSON.parse(localStorage.getItem('Users'));
    //   users = [user, ...users];
    // } else {
    //   users = [user];
    // }
    // localStorage.setItem('Users', JSON.stringify(users));
  }
}
