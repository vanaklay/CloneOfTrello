import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLogged = false;
  constructor(
    private authService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    firebase.auth().onAuthStateChanged(
      (userSession) => {
        if (userSession) {
          console.log(userSession);
          this.isLogged = true;
        } else {
          this.isLogged = false;
        }
      }
    );
  }

  onSignOut(){
    this.authService.signOutUser();
  }

}
