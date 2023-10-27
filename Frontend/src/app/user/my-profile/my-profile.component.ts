import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent {
  user: any;
  canEditEmail: boolean = false;
  canEditMobile: boolean = false;
  mobileControl: FormControl;
  profileForm: FormGroup;

  @ViewChild('emailInput') emailInput: ElementRef;
  @ViewChild('mobileInput') mobileInput: ElementRef;

  pageSize: number = 6;
  currentPage: number = 1;

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {
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

  ngOnInit() {
    this.userService.getLoggedInUserDetails().subscribe((response: any) => {
      this.user = response;
      console.log(this.user);
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
      const valid = /^\d{10}$/.test(mobileNumber);

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
}
