import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmActionComponent } from 'src/app/confirm-action/confirm-action.component';
import { Property } from 'src/app/model/property';
import { AlertifyService } from 'src/app/services/alertify.service';
import { HousingService } from 'src/app/services/housing.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css'],
  animations: [
    trigger('notificationState', [
      state('hidden', style({ opacity: 0, transform: 'translateY(-100%)' })),
      state('visible', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('hidden => visible', animate('200ms ease-in')),
      transition('visible => hidden', animate('200ms ease-out')),
    ]),
  ]
})
export class MyProfileComponent {
  user: any;
  canEditEmail: boolean = false;
  canEditMobile: boolean = false;
  mobileControl: FormControl;
  profileForm: FormGroup;

  @ViewChild('emailInput') emailInput: ElementRef;
  @ViewChild('mobileInput') mobileInput: ElementRef;

  processingRequest: boolean = false;

  pageSize: number = 6;
  currentPage: number = 1;

  screenWidthLessThan992px: boolean;
  screenWidthLessThan768px: boolean;
  screenWidthLessThan576px: boolean;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private matDialog: MatDialog,
    private housingService: HousingService,
    private alertify: AlertifyService
  ) {
    this.screenWidthLessThan992px = window.innerWidth <= 992;
    this.screenWidthLessThan768px = window.innerWidth <= 768;
    this.screenWidthLessThan576px = window.innerWidth <= 576;
    this.applyResponsiveOptions();
    this.profileForm = this.fb.group({
      mobile: ['', [Validators.required, this.mobileValidator()]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  toggleEditEmail() {
    this.canEditEmail = true;
    this.emailInput.nativeElement.focus();
  }

  onEmailInputBlur() {
    this.canEditEmail = false;
    this.profileForm.controls.email.setValue(this.user.email);
  }

  toggleEditMobile() {
    this.canEditMobile = true;
    this.mobileInput.nativeElement.focus();
  }

  onMobileInputBlur() {
    this.canEditMobile = false;
    this.profileForm.controls.mobile.setValue(this.user.mobile);
  }

  updateUserMobile() {
    if (this.Mobile.valid && this.canEditMobile) {
      this.userService.updateMobile(this.Mobile.value).subscribe((response: any) => {
        if (response == 201) {
          this.alertify.success('Mobile number updated successfully');
          this.user.mobile = this.Mobile.value;
          this.onMobileInputBlur();
        }
      });
    }
  }

  updateUserEmail() {
    if (this.Email.valid && this.canEditEmail) {
      this.userService.updateEmail(this.Email.value).subscribe((response: any) => {
        if (response == 201) {
          this.alertify.success('Email updated successfully');
          this.user.email = this.Email.value;
          this.onEmailInputBlur();
        }
      });
    }
  }

  applyResponsiveOptions() {
    if (this.screenWidthLessThan992px) {
      this.pageSize = 4;
    }

    if (this.screenWidthLessThan768px) {
      this.pageSize = 2;
    } else {
      this.pageSize = 6;
    }
  }

  confirmDelete(property: any) {
    if (this.processingRequest) {
      return;
    }

    const dialogRef = this.matDialog.open(ConfirmActionComponent, {
      width: '500px',
      data: {
        displayMessage: `Are you sure you want to remove your property listing in ${property.name}, ${property.city}?`,
        confirmButtonName: 'Yes',
        imageUrl: property.photo
      },

    })


    dialogRef.componentInstance.deleteConfirmed.subscribe(() => {
      this.deleteProperty(property.id);
      dialogRef.close();
    });

    dialogRef.componentInstance.deleteCancelled.subscribe(() => {
      dialogRef.close();
    })
  }

  deleteProperty(id: number) {
    this.processingRequest = true;
    this.housingService.deleteProperty(id).subscribe((response: any) => {
      if (response == 201) {
        this.user.properties = this.user.properties.filter((property: Property) => property.id !== id);
        this.alertify.success('Successfully deleted property listing');
      }
      this.processingRequest = false;
    })
  }



  ngOnInit() {
    this.userService.getLoggedInUserDetails().subscribe((response: any) => {
      this.user = response;
      this.profileForm.controls.mobile.setValue(this.user.mobile);
      this.profileForm.controls.email.setValue(this.user.email);
    })
  }

  mobileValidator() {
    return (control: any) => {
      const mobileNumber = control.value;

      if (!mobileNumber) {
        return null;
      }
      const valid = /^\+?\d{9,15}$/.test(mobileNumber);

      return valid ? null : { invalidMobile: true };
    };
  }

  get Email() {
    return this.profileForm.controls.email as FormControl;
  }
  get Mobile() {
    return this.profileForm.controls.mobile as FormControl;
  }

  get pagedData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.user.properties.slice(startIndex, startIndex + this.pageSize);
  }

  test() {
    console.log(this.screenWidthLessThan992px);
    console.log(this.screenWidthLessThan768px);
    console.log(this.screenWidthLessThan576px);
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: any) {
    this.screenWidthLessThan992px = window.innerWidth <= 992;
    this.screenWidthLessThan768px = window.innerWidth <= 768;
    this.screenWidthLessThan576px = window.innerWidth <= 576;

    this.applyResponsiveOptions();
  }
}
