import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent implements OnInit {

  email = '';
  constructor(
    private authService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    firebase.auth().onAuthStateChanged(
      (userSession) => {
        if(userSession) {
          this.email = userSession.email;
        } else {
          this.email = '';
        }

      }
    );
  }
  onSignOut(){
    this.authService.signOutUser();
  }
}
