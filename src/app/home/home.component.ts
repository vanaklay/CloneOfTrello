import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ListService } from '../list.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  listForm: FormGroup;
  listSubscription: Subscription;
  listOfList: any[] = [];

  taskForm: FormGroup;
  taskSubsciption: Subscription;
  taskList: any[] = [];

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

  onSubmitListForm(){
    const newList = this.listForm.value;
    this.listService.createList(newList);
  }

  initTaskForm() {
    this.taskForm = this.formBuilder.group({
      title: ['', Validators.required]
    })
  }

  onSubmitTaskForm(){
    const newTask = this.taskForm.value;
    this.listService.createListOfTask(newTask);
  }

}
