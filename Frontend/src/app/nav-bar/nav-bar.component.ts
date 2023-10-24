import { Component } from '@angular/core';
import { AlertifyService } from '../services/alertify.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  loggedinUser: string;

  constructor(
    private alertify: AlertifyService,
    private userService: UserService) {}

  ngOnInit() {

  }

  loggedIn() {
    this.loggedinUser = localStorage.getItem('userName');
    return this.loggedinUser;
  }

  onLogout() {
    this.alertify.success("You have logged out.");
    this.userService.logout();
  }
}
