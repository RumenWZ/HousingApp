import { Component } from '@angular/core';
import { AlertifyService } from '../services/alertify.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { SidenavService } from '../services/sidenav.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  loggedinUser: string;

  constructor(
    private alertify: AlertifyService,
    private userService: UserService,
    private sidenav: SidenavService) {}

  ngOnInit() {

  }

  loggedIn() {
    this.loggedinUser = localStorage.getItem('userName');
    return this.loggedinUser;
  }

  toggleSidenav() {
    this.sidenav.toggleSidenav();
  }

  onLogout() {
    this.alertify.success("You have logged out.");
    this.userService.logout();
  }
}
