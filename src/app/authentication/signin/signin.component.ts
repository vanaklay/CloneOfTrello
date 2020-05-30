import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  signinForm: FormGroup;
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
    this.initForm();
  }

  initForm() {
    this.signinForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password:['', [Validators.required, Validators.minLength(6)]]
    })
  }

  onSubmitSignIn(){
    const email = this.signinForm.get('email').value;
    const password = this.signinForm.get('password').value;
    this.authService.signInUser(email, password).then((data)=> {
      // console.log(data['user']['uid']);
      this.router.navigate(['/home']);
    }).catch((error) => {
      console.log(error);
    });
  }



}
