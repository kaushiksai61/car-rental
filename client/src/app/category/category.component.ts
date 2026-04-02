import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  itemForm!: FormGroup;
  //reactive form for car category
  categoryList: any = [];
  //list of car categories
  updateId: any;
  //category id for update
  showError = false;
  //error flag
  errorMessage: any;
  //error message
  showMessage = false;
  //success flag
  responseMessage: any;
  //success message

  constructor(
    private fb: FormBuilder,
    //form builder
    private router: Router,
    //router navigation
    private http: HttpService,
    //http service
    private auth: AuthService
    //auth service
  ) {
    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      baseRate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getCategories();
  }
  //get all categories
  getCategories() {
    this.http.getAllCategories().subscribe(
      (res) => this.categoryList = res,
      () => {
        this.showError = true;
        this.errorMessage = "Could not load categories.";
      }
    );
  }
// edit car category
  edit(val: any) {
    this.updateId = val.id;
    //set category id
    this.itemForm.patchValue(val);
  }
 // submit add or update category
  onSubmit() {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }
   

    if (this.updateId) {
      //update car category
      this.http.updateCategory(this.itemForm.value, this.updateId).subscribe(
        () => this.afterSave("Category updated."),
        () => this.showError = true
      );
    } else {
      //create car category
      this.http.createCategory(this.itemForm.value).subscribe(
        () => this.afterSave("Category created."),
        () => this.showError = true
      );
    }
  }
//post save actions
  afterSave(msg: string) {
    this.showMessage = true;
    this.responseMessage = msg;
    this.itemForm.reset();
    this.updateId = null;
    this.getCategories();
    // refresh category list
  }
}