import { Department } from './../interfaces/department';
import { DepartmentService } from './../services/department.service';
import { Product } from './../interfaces/product';
import { ProductService } from './../services/product.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, OnDestroy {

  productForm: FormGroup = this.fb.group({
    _id: [null],
    name: ['', Validators.required],
    stock: [0, [Validators.required, Validators.min(0)]],
    price: [0, [Validators.required, Validators.min(0)]],
    departments: [[], Validators.required],
  });

  @ViewChild('form', { static: true }) form: NgForm;

  products: Product[] = [];
  departments: Department[] = [];
  private unsubscribe$: Subject<any> = new Subject();

  constructor(private service: ProductService, private fb: FormBuilder,
              private depService: DepartmentService, private snackbar: MatSnackBar) { }


  ngOnInit() {
    this.service.get()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((prods) => {
        this.products = prods;
      });

    this.depService.get()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((deps) => {
        this.departments = deps;
      });
  }

  save() {
    let data = this.productForm.value;
    if (data._id != null) {
      this.service.update(data)
      .subscribe((p) => this.notify('Atualizado com sucesso!'));
    } else {
      this.service.add(data)
        .subscribe((p) => this.notify('Criado com sucesso!'));
    }
    this.resetForm();
  }

  delete(p: Product) {
    this.service.delete(p)
      .subscribe(() => {
        this.notify('Deletado com sucesso!');
      }, (err) => {
        this.notify('Erro ao deletar!');
      });
  }

  edit(p: Product) {
    this.productForm.setValue(p);
  }

  notify(msg: string) {
    this.snackbar.open(msg, 'OK', { duration: 3000 });
  }

  resetForm() {
    // this.productForm.reset();
    this.form.resetForm();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

}
