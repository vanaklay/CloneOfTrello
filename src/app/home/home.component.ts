import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { ListService } from '../list.service';
import { Subscription } from 'rxjs';
import * as $ from 'jquery';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  listForm: FormGroup;
  listSubscription: Subscription;
  listOfList: any[] = [];
  listId;
  listIndexToCreate;
  isListEmpty = true;

  taskForm: FormGroup;
  taskSubsciption: Subscription;
  taskList: any[] = [];
  taskIndexToRemove;
  taskIndexToUpdate;
  updateMode = false;

  constructor(
    private formBuilder: FormBuilder,
    private listService: ListService
  ) { }

  ngOnInit(): void {
    this.initListForm();
    this.initTaskForm();
    this.listSubscription = this.listService.listSubject.subscribe(
      (data: any) => {
        this.listOfList = data;
      }
    );
    this.taskSubsciption = this.listService.taskSubject.subscribe(
      (data: any) => {
        this.taskList = data;
      }
    );
    this.listService.getLists();
    this.listService.getTask();
    this.listService.emitList();
  }

  // Lists
  initListForm() {
    this.listForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(30)]],
      id: ''
    });
  }

  onReset() {
    this.listId = null;
    this.listForm.reset();
  }

  onSubmitListForm(){
    this.updateMode = false;
    let uniqueId = Date.now() + this.listOfList.length;
    const newList = {
      title: this.listForm.get('title').value,
      id: uniqueId
    }
    this.listService.createList(newList);
    $('#listFormModal').modal('hide');
  }

  onDeleteList(id){
    $('#deleteListModal').modal('show');
    this.isListEmpty = this.countTaskOnList(id);
    console.log('value of isEmpty',this.isListEmpty);
    this.listId = id;
  }
  onConfirmDeleteList() {
    this.listService.deleteList(this.listId);
    $('#deleteListModal').modal('hide');
  }

  countTaskOnList(id){
    let count = 0;
    this.taskList.forEach(task => {
      if (id === task.listId) {
        count++;
      }
    });
    if (count > 0) {
      return false;
    } else { return true }
  }



  // Tasks
  initTaskForm() {
    this.taskForm = this.formBuilder.group({
      title: ['', Validators.required],
      id: '',
      listId: ''
    })
  }

  addTask(id) {
    this.updateMode = false;
    $('#taskFormModal').modal('show');
    this.taskForm.reset();
    this.listId = id;
  }

  onSubmitTaskForm(){
    let uniqueTaskId = Date.now() + this.listOfList.length;
    const newTask = {
      title: this.taskForm.value.title,
      id: uniqueTaskId,
      listId: this.listId
    };
    if (this.updateMode) {
      const updatedTask = {
        title: this.taskForm.value.title,
        id: this.taskForm.value.id,
        listId: this.taskForm.value.listId
      }
      this.listService.updateListOfTask(updatedTask, this.taskIndexToUpdate);
    } else { this.listService.createListOfTask(newTask); }
    $('#taskFormModal').modal('hide');
  }

  onEditTask(task) {
    this.updateMode = true;
    $('#taskFormModal').modal('show');
    this.taskForm.get('title').setValue(task.title);
    this.taskForm.get('id').setValue(task.id);
    this.taskForm.get('listId').setValue(task.listId);
    const index = this.taskList.findIndex(
      (taskEl) => {
        if (taskEl === task) {
          return true;
        }
      }
    );
    this.taskIndexToUpdate = index;
  }

  onDeleteTask(id){
    $('#deleteTaskModal').modal('show');
    const index = this.taskList.findIndex(
      (elt) => {
        if (elt.id == id){
          return true;
        }
      }
    );
    this.taskIndexToRemove = index;
  }

  onConfirmDeleteTask(){
    this.listService.deleteTask(this.taskIndexToRemove);
    this.listService.getTask();
    $('#deleteTaskModal').modal('hide');
  }


}
