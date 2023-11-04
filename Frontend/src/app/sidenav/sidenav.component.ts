import { Component } from '@angular/core';
import { sidenavGeneralEntries, sidenavUserEntries } from './sidenav-entries';
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
      state('open', style({  display: 'block'})),
      // transition('closed => open', animate('200ms ease')),
      // transition('open => closed', animate('200ms ease'))
    ])
  ]
})
export class SidenavComponent {
  sidenavGeneralEntries = sidenavGeneralEntries;
  sidenavUserEntries = sidenavUserEntries;
  user: any;
  generalDrawerState = 'closed';
  userDrawerState = 'closed';

  constructor(
    private sidenav: SidenavService,
    private router: Router,
    private userService: UserService
  ) {}

  navigateUrl(url: string) {
    if (url == 'logout') {
      return this.onLogout();
    }
    this.router.navigate([url]);
    this.toggleSidenav();

  }

  toggleSidenav() {
    this.sidenav.toggleSidenav();
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

  ngOnInit() {
    this.userService.getLoggedInUser().subscribe((response: any) => {
      this.user = response;
    });
  }
}
