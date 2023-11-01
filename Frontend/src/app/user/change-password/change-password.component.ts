import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertifyService } from 'src/app/services/alertify.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;

  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private router: Router
  ) {
    this.changePasswordForm = new FormGroup({
      password: new FormControl(null, [Validators.required]),
      newPassword: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(64)]),
      repeatNewPassword: new FormControl(null, [Validators.required])
    }, this.passwordMatchingValidator);
  }

  passwordMatchingValidator(fc: AbstractControl): ValidationErrors | null {
    const passwordControl = fc.get('newPassword');
    const confirmPasswordControl = fc.get('repeatNewPassword');

    if (passwordControl && confirmPasswordControl) {
      const passwordValue = passwordControl.value;
      const confirmPasswordValue = confirmPasswordControl.value;

      if (passwordValue !== confirmPasswordValue) {
        confirmPasswordControl.setErrors({ notmatched: true });
        return { notmatched: true };
      } else {
        confirmPasswordControl.setErrors(null);
        return null;
      }
    }
    return null;
  }

  onSubmit() {
    if (this.changePasswordForm.valid) {
      const formData = {
        oldPassword: this.password.value,
        newPassword: this.newPassword.value
      }

      this.userService.changePassword(formData).subscribe((response: any) => {
        if (response == 201) {
          this.router.navigate(['/']);
          this.alertify.success('Successfully changed password');
        }
      })
    }
  }

  ngOnInit() {

  }

  //#region form values
  get password() {
    return this.changePasswordForm.get('password') as FormControl;
  }
  get newPassword() {
    return this.changePasswordForm.get('newPassword') as FormControl;
  }
  get repeatNewPassword() {
    return this.changePasswordForm.get('repeatNewPassword') as FormControl;
  }
  //#endregion
}
