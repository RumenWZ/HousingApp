import { Component } from '@angular/core';
import { scrollToMenuItems } from './scroll-to-menu-entries';

@Component({
  selector: 'app-scroll-to-menu',
  templateUrl: './scroll-to-menu.component.html',
  styleUrls: ['./scroll-to-menu.component.css']
})
export class ScrollToMenuComponent {
  menuData = scrollToMenuItems;

  constructor() {}

  scrollTo(sectionId: string): void {
    const element = document.getElementById(sectionId);

    if (element) {
      document.querySelector('mat-sidenav-content').scrollTop = element.offsetTop - 70;
    } else {
    }
  }

}
