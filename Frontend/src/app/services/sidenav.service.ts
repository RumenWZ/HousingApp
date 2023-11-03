import { Injectable } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  private _isSidenavOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private isTransitioning: boolean = false;

  constructor() { }

  toggleSidenav(): void {
    if (!this.isTransitioning) {
      this.isTransitioning = true;
      this._isSidenavOpen.next(!this._isSidenavOpen.value);

      timer(375).subscribe(() => {
        this.isTransitioning = false;
      });
    }
  }

  get isSidenavOpen(): BehaviorSubject<boolean> {
    return this._isSidenavOpen;
  }
}
