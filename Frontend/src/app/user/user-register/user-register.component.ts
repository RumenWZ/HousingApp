import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
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
    private fb: FormBuilder,
    private userService: UserService,
    private alertify: AlertifyService) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      userName: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl(null, Validators.required),
      mobile: new FormControl(null, [Validators.required, Validators.maxLength(10)])
    }, this.passwordMatchingValidator);
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      userName: [null, Validators.required],
      email: [null, Validators.email, Validators.required],
      password: [null, Validators.required, Validators.minLength(8)],
      confirmPassword: [null, Validators.required],
      mobile: [null, [Validators.required, Validators.maxLength(10)]]
    }, {Validators: this.passwordMatchingValidator});
  }

  passwordMatchingValidator(fc: AbstractControl): ValidationErrors | null {
    return fc.get('password')?.value === fc.get('confirmPassword')?.value ? null :
      { notmatched: true }
  };

  onSubmit(){
    console.log(this.registerForm);
    this.userSubmitted = true;
    if (this.registerForm.valid) {
      // this.user = Object.assign(this.user, this.registerForm.value);
      this.userService.addUser(this.userData());
      this.registerForm.reset();
      this.userSubmitted = false;
      this.alertify.success('Successful registration!')
    } else {
      this.alertify.error('Please enter valid credentials.')
    }
  }

  userData(): User {
    return this.user = {
      userName: this.userName.value,
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
