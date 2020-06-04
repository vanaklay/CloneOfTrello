import { Component } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor() {
    const firebaseConfig = {
      apiKey: "AIzaSyAIdF6kXGH3En5XXCOs3s32bZQ-NCsdqIM",
      authDomain: "trello-b2971.firebaseapp.com",
      databaseURL: "https://trello-b2971.firebaseio.com",
      projectId: "trello-b2971",
      storageBucket: "trello-b2971.appspot.com",
      messagingSenderId: "510234610894",
      appId: "1:510234610894:web:2da273d7705981684bd49f"
    };
    firebase.initializeApp(firebaseConfig);

  }
}
