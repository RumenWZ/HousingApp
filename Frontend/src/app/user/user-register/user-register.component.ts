import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/services/user.service';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})

export class UserRegisterComponent {
  registerForm!: FormGroup;
  user: User;
  userSubmitted :boolean;


  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    ) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      userName: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl(null, Validators.required),
      mobile: new FormControl(null, [Validators.required, Validators.maxLength(10)])
    }, this.passwordMatchingValidator);
  }

  passwordMatchingValidator(fc: AbstractControl): ValidationErrors | null {
    const passwordControl = fc.get('password');
    const confirmPasswordControl = fc.get('confirmPassword');

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

  onSubmit(){
    this.userSubmitted = true;

    if (this.registerForm.valid) {

      this.userService.addUser(this.userData()).subscribe(() => {
        this.registerForm.reset();
        this.userSubmitted = false;

        this.alertify.success('Successful registration!');
      });
    }
  }

  userData(): User {
    return this.user = {
      username: this.userName.value,
      email: this.email.value,
      password: this.password.value,
      mobile: this.mobile.value
    };
  }

  get userName() {
    return this.registerForm.get('userName') as FormControl;
  }

  get email() {
    return this.registerForm.get('email') as FormControl;
  }

  get password() {
    return this.registerForm.get('password') as FormControl;
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword') as FormControl;
  }

  get mobile() {
    return this.registerForm.get('mobile') as FormControl;
  }
}
