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
      title: 'Create HomePage'
    },
    {
      title: 'Authentication'
    },
    {
      title: 'WorkPage'
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
  }

  createListOfTask(task) {
    this.listOfTask.push(task);
  }
}
