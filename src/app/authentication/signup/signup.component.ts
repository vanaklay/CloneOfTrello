import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  signUpSuccess = false;
  trySignUp = false;
  isLogged = false;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    firebase.auth().onAuthStateChanged(
      (userSession) => {
        if (userSession) {
          this.isLogged = true;
        } else {
          this.isLogged = false;
        }
      }
    );
    this.signUpSuccess = false;
    this.trySignUp = false;
    this.initSignUp();
  }

  initSignUp(){
    this.signupForm = this.formBuilder.group(
      {
        email: ['', [Validators.email, Validators.required]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      }
    )
  }

  onSubmitSignUp(){
    this.trySignUp = true;
    const email = this.signupForm.get('email').value;
    const password = this.signupForm.get('password').value;
    this.authService.signUpUser(email, password).then( () => {
      console.log('User created successfully');
      this.signUpSuccess = true;
      }).catch((error) => {
      console.log(error);
    })
  }

}
