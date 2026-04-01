import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  itemForm!: FormGroup;
  formModel: any = { status: null };
  showError: boolean = false;
  errorMessage: any;
  categoryList: any = [];
  assignModel: any = {};
  showMessage: any;
  responseMessage: any;
  updateId: any;
  isLoading: boolean = false;
  isTableLoading: boolean = false;

  constructor(
    private router: Router,
    private http: HttpService,
    private fb: FormBuilder,
    private auth: AuthService
  ) {
    this.itemForm = this.fb.group({
      name:        ['', Validators.required],
      description: ['', Validators.required],
      baseRate:    ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(): void {
    this.isTableLoading = true;
    this.http.getAllCategories().subscribe(
      (res: any) => {
        this.categoryList = res;
        this.isTableLoading = false;
      },
      () => {
        this.showError = true;
        this.errorMessage = 'Failed to load categories. Please try again.';
        this.isTableLoading = false;
      }
    );
  }

  onSubmit(): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.showMessage = false;
    this.showError = false;

    if (this.updateId) {
      this.http.updateCategory(this.itemForm.value, this.updateId).subscribe(
        () => {
          this.isLoading = false;
          this.showMessage = true;
          this.responseMessage = 'Category updated successfully.';
          this.itemForm.reset();
          this.updateId = null;
          this.getCategories();
        },
        () => {
          this.isLoading = false;
          this.showError = true;
          this.errorMessage = 'Failed to update category. Please try again.';
        }
      );
    } else {
      this.http.createCategory(this.itemForm.value).subscribe(
        () => {
          this.isLoading = false;
          this.showMessage = true;
          this.responseMessage = 'Category created successfully.';
          this.itemForm.reset();
          this.getCategories();
        },
        () => {
          this.isLoading = false;
          this.showError = true;
          this.errorMessage = 'Failed to create category. Please try again.';
        }
      );
    }
  }

  edit(val: any): void {
    this.updateId = val.id;
    this.itemForm.patchValue(val);
    this.showMessage = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.updateId = null;
    this.itemForm.reset();
    this.showMessage = false;
    this.showError = false;
  }
}