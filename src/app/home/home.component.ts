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
  listIndexToCreate;

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
    this.listService.emitList();
  }

  initListForm() {
    this.listForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(30)]]
    });
  }

  initTaskForm() {
    this.taskForm = this.formBuilder.group({
      title: ['', Validators.required],
      id: ''
    })
  }

  onSubmitListForm(){
    this.updateMode = false;
    const newList = this.listForm.value;
    this.listService.createList(newList);
    $('#listFormModal').modal('hide');
  }

  addTask(index) {
    this.updateMode = false;
    $('#taskFormModal').modal('show');
    this.taskForm.reset();
    this.listIndexToCreate = index;
  }



  onSubmitTaskForm(){
    const newTask = {
      title: this.taskForm.value.title,
      id: this.listIndexToCreate
    };
    if (this.updateMode) {
      const newTask = {
        title: this.taskForm.value.title,
        id: this.taskForm.value.id
      };
      this.listService.updateListOfTask(newTask, this.taskIndexToUpdate);
    } else { this.listService.createListOfTask(newTask); }
    $('#taskFormModal').modal('hide');
  }


  onDeleteTask(index){
    $('#deleteTaskModal').modal('show');
    this.taskIndexToRemove = index;
  }

  onConfirmDeleteTask(){
    this.listService.deleteTask(this.taskIndexToRemove);
    $('#deleteTaskModal').modal('hide');
  }

  onEditTask(task) {
    this.updateMode = true;
    $('#taskFormModal').modal('show');
    this.taskForm.get('title').setValue(task.title);
    this.taskForm.get('id').setValue(task.id);
    const index = this.taskList.findIndex(
      (taskEl) => {
        if (taskEl === task) {
          return true;
        }
      }
    );
    this.taskIndexToUpdate = index;
  }
}
