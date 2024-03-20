import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  private _isSidenavOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private isTransitioning: boolean = false;
  private _updateSidenav: Subject<void> = new Subject<void>();

  constructor() {}

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

  get sidenavUpdated$(): Observable<void> {
    return this._updateSidenav.asObservable();
  }

  updateSidenav(): void {
    this._updateSidenav.next();
  }
}
