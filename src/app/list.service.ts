import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  listOfList: any[] = [];

  listSubject = new Subject<any[]>();

  constructor() { }

  emitList(){
    this.listSubject.next(this.listOfList);

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
            if (data.val()) {
              let tmpList = [];
              data.val().forEach( elt => {
                let list = {
                  id: elt.id,
                  tasks: elt.tasks ? elt.tasks : [],
                  title: elt.title
                };
                tmpList.push(list);
              })
              this.listOfList = tmpList;
            } else {
              this.listOfList = [];
            }
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

  createListOfTask(task, listId, userId) {
    this.listOfList.forEach(list => {
      if (list.id === listId) {
        if (list.tasks && list.tasks.length > 0) {
          list.tasks.push(task);
        } else {
          list['tasks'] = [task];
        }
        this.saveLists(userId);
        this.emitList();
      }
    })
  }

  updateListOfTask(task, index, listId, userId) {
    this.listOfList.forEach(list => {
      if (list.id === listId) {
        list.tasks[index] = task;
        this.saveLists(userId);
        this.emitList();
      }
    })
  }

  deleteTask(index, listId, userId) {
    this.listOfList.forEach(list => {
      if (list.id === listId) {
        list.tasks.splice(index, 1)
      }
    })
    this.saveLists(userId)
    this.emitList();
  }

  // Animations
    saveAnimation(list, userId){
      this.listOfList = list;
      this.saveLists(userId);
    }


}
