import { Component } from '@angular/core';
import { SidenavService } from './services/sidenav.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  sidenavOpen: boolean;
  title = 'Housing App';
  token: string;

  constructor(
    private sidenav: SidenavService
  ) {
    this.token = localStorage.getItem('token');
  }

  toggleSidenav() {
    this.sidenav.toggleSidenav();
  }

  ngOnInit() {
    this.sidenav.isSidenavOpen.subscribe((isOpen: boolean) => {
      this.sidenavOpen = isOpen;
    })
  }
}
