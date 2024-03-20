import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.css']
})
export class DocumentationComponent {
  isScrollToTopVisible: boolean = false;


  checkIfScrollToTopVisible() {
    const pageScrollY = document.querySelector('mat-sidenav-content').scrollTop;
    this.isScrollToTopVisible = pageScrollY > 500 ? true : false;
  }

  onBackToTop() {
    document.querySelector('mat-sidenav-content').scrollTop = 0;
  }

  ngOnInit() {
    document.querySelector('mat-sidenav-content').addEventListener('scroll', ()=> {
      this.checkIfScrollToTopVisible();
    })
  }
}
