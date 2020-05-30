import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  listOfList: any[] = [];
  listByUser: any[] = [];
  listOfTask: any[] = [];

  listSubject = new Subject<any[]>();
  userSubject = new Subject<any[]>();
  taskSubject = new Subject<any[]>();

  constructor() { }

  emitList(){
    this.listSubject.next(this.listOfList);
    this.taskSubject.next(this.listOfTask);
    this.userSubject.next(this.listByUser);

  }
  // lists
  createList(list) {
    this.listOfList.push(list);
    this.saveLists();
    this.emitList();
  }

  saveLists() {
    firebase.database().ref('/lists').set(this.listOfList);
  }

  getLists() {
    firebase.database().ref('/lists').on('value', (data) => {
      this.listOfList = data.val() ? data.val() : [];
      this.emitList();
    });
  }

  getListById() {
    firebase.auth().onAuthStateChanged(
      (userSession) => {
        if (userSession) {
          firebase.database().ref('/lists/').on('value', (data) => {
            data.val().forEach(element => {
              if(element.userId === userSession.uid) {
                this.listByUser.push(element);
              }
            })
            this.emitList();
          });
        } else {
          console.log('User not connected');
        }
      }
    );

  }

  deleteList(id) {
    const index = this.listOfList.findIndex(
      (elt) => {
        if (elt['id'] === id) {
          return true;
        }
      }
    );
    this.listOfList.splice(index, 1);
    this.saveLists();
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
