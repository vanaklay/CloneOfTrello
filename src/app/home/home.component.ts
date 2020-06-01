import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { ListService } from '../list.service';
import { Subscription } from 'rxjs';
import * as $ from 'jquery';
import * as firebase from 'firebase';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  // list properties
  listForm: FormGroup;
  listSubscription: Subscription;
  listOfList: any[] = [];
  listId: string;
  listIdToUpdate: string;
  listIdToDelete: string;
  listIndexToCreate: string;
  isListEmpty: boolean = true;

  // task properties
  taskForm: FormGroup;
  taskIndexToRemove: string;
  taskIndexToUpdate: string;
  updateMode: boolean = false;

  // auth properties
  isLogged: boolean = false;
  userId: string;
  listByUser: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private listService: ListService,

  ) { }

  ngOnInit(): void {
    firebase.auth().onAuthStateChanged(
      (userSession) => {
        if (userSession) {
          this.isLogged = true;
          this.userId = userSession.uid;
        } else {
          this.isLogged = false;
          this.userId = '';
        }
      }
    );
    this.initListForm();
    this.initTaskForm();
    this.listSubscription = this.listService.listSubject.subscribe(
      (data: any) => {
        this.listOfList = data;
      }
    );

    this.listService.getLists();
    // this.listService.emitList();
  }

  // Lists
  initListForm() {
    this.listForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(30)]],
      id: '',
      tasks: []
    });
  }

  onReset() {
    this.listId = null;
    this.listForm.reset();
  }

  onSubmitListForm(){
    this.updateMode = false;
    let uniqueId = Date.now() + this.listOfList.length;
    let listOfTasks: any[] = [];
    const newList = {
      title: this.listForm.get('title').value,
      id: uniqueId,
      tasks: listOfTasks
    }
    this.listService.createList(newList, this.userId);
    $('#listFormModal').modal('hide');
  }

  onDeleteList(id){
    $('#deleteListModal').modal('show');
    this.listId = id;
  }
  onConfirmDeleteList() {
    this.listService.deleteList(this.listId, this.userId);
    $('#deleteListModal').modal('hide');
  }


  // Tasks
  initTaskForm() {
    this.taskForm = this.formBuilder.group({
      title: ['', Validators.required],
      id: '',
    })
  }

  addTask(fromListId) {
    this.updateMode = false;
    $('#taskFormModal').modal('show');
    this.taskForm.reset();
    this.listId = fromListId;
  }

  onSubmitTaskForm(){
    let uniqueTaskId = Date.now() + this.listOfList.length;
    const newTask = {
      title: this.taskForm.value.title,
      id: uniqueTaskId
    };
    if (this.updateMode) {
      const updatedTask = {
        title: this.taskForm.value.title,
        id: this.taskForm.value.id
      }
      this.listService.updateListOfTask(updatedTask, this.taskIndexToUpdate, this.listIdToUpdate, this.userId);
    } else { this.listService.createListOfTask(newTask, this.listId, this.userId); }
    $('#taskFormModal').modal('hide');
  }

  onEditTask(task, listId) {
    this.updateMode = true;
    $('#taskFormModal').modal('show');
    this.taskForm.get('title').setValue(task.title);
    this.taskForm.get('id').setValue(task.id);
    let index = '';
    this.listOfList.forEach(list => {
      if (list.id === listId) {
        index = list.tasks.findIndex(
          (elt) => {
            if (elt.id === task.id) {
              return true;
            }
          }
        )
      }
    });
    this.taskIndexToUpdate = index;
    this.listIdToUpdate = listId;
  }

  onDeleteTask(id, listId){
    $('#deleteTaskModal').modal('show');
    let index = '';
    this.listOfList.forEach(list => {
      if (list.id === listId) {
        index = list.tasks.findIndex(
          (elt) => {
            if (elt.id === id) {
              return true;
            }
          }
        )
      }
    });
    this.taskIndexToRemove = index;
    this.listIdToDelete = listId;
  }

  onConfirmDeleteTask(){
    this.listService.deleteTask(this.taskIndexToRemove, this.listIdToDelete, this.userId);
    $('#deleteTaskModal').modal('hide');
  }

  // Animations
  onTaskDrop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.listService.saveAnimation(this.listOfList, this.userId);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
        this.listService.saveAnimation(this.listOfList, this.userId);
    }
  }



}
