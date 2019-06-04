import { Component, OnInit, OnDestroy } from '@angular/core';
import { Department } from '../interfaces/department';
import { DepartmentService } from '../services/department.service';
import { MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit, OnDestroy {

  depName: string;
  departments: Department[] = [];
  depEdit: Department = null;
  private unsubscribe$: Subject<any> = new Subject();

  constructor(private service: DepartmentService, private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.service.get()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((deps) => {
        this.departments = deps;
      });
  }

  save() {
    if (this.depEdit) {
      this.service.update({ name: this.depName, _id: this.depEdit._id })
        .subscribe((dep) => {
          this.notify('Atualizado com sucesso!');
          this.clearFields();
        }, (err) => {
          this.notify('Erro ao atualizar!');
          console.error(err);
        });
    } else {
      this.service.add({ name: this.depName }).subscribe((dep) => {
        console.log(dep);
        this.notify('Criado com sucesso!');
        this.clearFields();
      }, (err) => {
        this.notify('Erro ao criar!');
        console.error(err);
      });
    }
  }

  clearFields() {
    this.depName = '';
    this.depEdit = null;
  }

  cancel() { console.log('testeaa'); }

  edit(dep: Department) {
    this.depName = dep.name;
    this.depEdit = dep;
  }

  delete(dep: Department) {
    this.service.delete(dep).subscribe(() => {
      console.log(dep);
      this.notify('Deletado com sucesso!');
      this.clearFields();
    }, (err) => {
      this.notify('Erro ao deletar!');
      console.error(err);
    });
  }

  notify(msg: string) {
    this.snackbar.open(msg, 'OK', { duration: 3000 });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

}
