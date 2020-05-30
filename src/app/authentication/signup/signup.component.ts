import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import * as firebase from 'firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  signUpFailed = false;
  emailAlreadyUse = false;
  isLogged = false;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
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
    const email = this.signupForm.get('email').value;
    const password = this.signupForm.get('password').value;
    this.authService.signUpUser(email, password).then( () => {
      this.router.navigate(['/home']);
      }).catch((error) => {
      console.log(error);
      if( error.code == 'auth/email-already-in-use') {
        this.emailAlreadyUse = true;
      } else {
        this.signUpFailed = true;
      }
    })
  }

}
