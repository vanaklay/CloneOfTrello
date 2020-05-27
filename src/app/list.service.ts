import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  listOfList: any[] = [
    {
      title: 'To do'
    },
    {
      title: 'Work in Progress'
    }
  ];

  listOfTask: any[] = [
    {
      title: 'Create HomePage',
      id: 0
    },
    {
      title: 'Authentication',
      id: 1
    },
    {
      title: 'WorkPage',
      id: 0
    },
    {
      title: 'CRUD list',
      id: 1
    }
  ];

  listSubject =  new Subject<any[]>();
  taskSubject = new Subject<any[]>();

  constructor() { }

  emitList(){
    this.listSubject.next(this.listOfList);
    this.taskSubject.next(this.listOfTask);
  }

  createList(list) {
    this.listOfList.push(list);
    this.emitList();
  }

  createListOfTask(task) {
    this.listOfTask.push(task);
    this.emitList();
  }

  deleteTask(index) {
    this.listOfTask.splice(index, 1);
    this.emitList();
  }

  updateListOfTask(task, index) {
    this.listOfTask[index] = task;
    this.emitList();
  }
}
