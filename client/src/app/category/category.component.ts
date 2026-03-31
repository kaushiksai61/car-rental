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
  categoryList: any = [];
  updateId: any;
  showError = false;
  errorMessage: any;
  showMessage = false;
  responseMessage: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpService,
    private auth: AuthService
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

  getCategories() {
    this.http.getAllCategories().subscribe(
      (res) => this.categoryList = res,
      () => {
        this.showError = true;
        this.errorMessage = "Could not load categories.";
      }
    );
  }

  edit(val: any) {
    this.updateId = val.id;
    this.itemForm.patchValue(val);
  }

  onSubmit() {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    if (this.updateId) {
      this.http.updateCategory(this.itemForm.value, this.updateId).subscribe(
        () => this.afterSave("Category updated."),
        () => this.showError = true
      );
    } else {
      this.http.createCategory(this.itemForm.value).subscribe(
        () => this.afterSave("Category created."),
        () => this.showError = true
      );
    }
  }

  afterSave(msg: string) {
    this.showMessage = true;
    this.responseMessage = msg;
    this.itemForm.reset();
    this.updateId = null;
    this.getCategories();
  }
}