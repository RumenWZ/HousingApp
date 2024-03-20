import { Component } from '@angular/core';
import { sidenavGeneralEntries, sidenavOtherEntries, sidenavUserEntries } from './sidenav-entries';
import { SidenavService } from '../services/sidenav.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
  animations: [
    trigger('drawerState', [
      state('closed', style({  display: 'none'})),
      state('open', style({  display: 'block'}))
    ])
  ]
})
export class SidenavComponent {
  sidenavGeneralEntries = sidenavGeneralEntries;
  sidenavUserEntries = sidenavUserEntries;
  sidenavOtherEntries = sidenavOtherEntries;
  user: any;
  generalDrawerState = 'closed';
  userDrawerState = 'closed';
  otherDrawerState = 'closed';

  constructor(
    private sidenav: SidenavService,
    private router: Router,
    private userService: UserService
  ) {
    this.sidenav.sidenavUpdated$.subscribe(() => {
      this.getUserDetails();
    })
  }

  navigateUrl(url: string) {
    if (url == 'logout') {
      return this.onLogout();
    }
    this.router.navigate([url]);
    this.toggleSidenav();

  }

  toggleSidenav() {
    this.sidenav.toggleSidenav();
    this.generalDrawerState = 'closed';
    this.userDrawerState = 'closed';
    this.otherDrawerState = 'closed';
  }

  onLogout() {
    this.userService.logout();
    this.router.navigate(['/']);
    this.toggleSidenav();
  }

  toggleGeneralDrawer() {
    this.generalDrawerState = (this.generalDrawerState === 'closed') ? 'open' : 'closed';
  }

  toggleUserDrawer() {
    this.userDrawerState = (this.userDrawerState === 'closed') ? 'open' : 'closed';
  }

  toggleOtherDrawer() {
    this.otherDrawerState = (this.otherDrawerState === 'closed') ? 'open' : 'closed';
  }

  getUserDetails() {
    if (localStorage.getItem('token')) {
      this.userService.getLoggedInUser().subscribe((response: any) => {
        this.user = response;
      });
    }
  }

  ngOnInit() {
    this.getUserDetails();
  }
}
