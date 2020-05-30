import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  listOfList: any[] = [];
  listOfTask: any[] = [];

  listSubject = new Subject<any[]>();
  taskSubject = new Subject<any[]>();

  constructor() { }

  emitList(){
    this.listSubject.next(this.listOfList);
    this.taskSubject.next(this.listOfTask);

  }
  // lists
  createList(list, userId) {
    this.listOfList.push(list);
    this.saveLists(userId);
    this.emitList();
  }

  saveLists(userId: string) {
    firebase.database().ref('/' + userId).set(this.listOfList);
  }

  getLists() {
    firebase.auth().onAuthStateChanged(
      (userSession) => {
        if(userSession) {
          firebase.database().ref('/' + userSession.uid).on('value', (data) => {
            this.listOfList = data.val() ? data.val() : [];
            this.emitList();
          });
        }
      }
    );

  }



  deleteList(id, userId) {
    const index = this.listOfList.findIndex(
      (elt) => {
        if (elt['id'] === id) {
          return true;
        }
      }
    );
    this.listOfList.splice(index, 1);
    this.saveLists(userId);
    this.emitList();
  }


  // Tasks
  saveTasks() {
    firebase.database().ref('/tasks').set(this.listOfTask);
  }

  getTask() {
    firebase.database().ref('/tasks').on('value', (data) => {
      this.listOfTask = data.val() ? data.val() : [];
      this.emitList();
    });
  }

  createListOfTask(task) {
    this.listOfTask.push(task);
    this.saveTasks();
    this.emitList();
  }

  updateListOfTask(task, index) {
    this.listOfTask[index] = task;
    this.saveTasks();
    this.emitList();
  }

  deleteTask(index) {
    this.listOfTask.splice(index, 1);
    this.saveTasks();
    this.emitList();
  }




}
