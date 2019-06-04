import { Department } from './../interfaces/department';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  readonly url = 'http://localhost:3000/departments';
  private departmentSubject$: BehaviorSubject<Department[]> = new BehaviorSubject<Department[]>(null);
  private loaded = false;

  constructor(private http: HttpClient) { }

  get(): Observable<Department[]> {
    if (!this.loaded) {
      this.http.get<Department[]>(this.url)
        .pipe(tap((deps) => console.log(deps)))
        .subscribe(this.departmentSubject$);
      this.loaded = true;
    }
    return this.departmentSubject$.asObservable();
  }

  add(d: Department): Observable<Department> {
    return this.http.post<Department>(this.url, d)
      .pipe(tap((dep: Department) => this.departmentSubject$.getValue().push(dep)));
  }

  delete(dep: Department): Observable<any> {
    return this.http.delete<Department>(`${this.url}/${dep._id}`)
      .pipe(tap(() => {
        let department = this.departmentSubject$.getValue();
        let i = department.findIndex((d) => d._id === dep._id);
        if (i >= 0) {
          department.splice(i, 1);
        }
      }));
  }

  update(dep: Department): Observable<Department> {
    return this.http.patch<Department>(`${this.url}/${dep._id}`, dep)
      .pipe(tap((depart) => {
        let department = this.departmentSubject$.getValue();
        let i = department.findIndex((d) => d._id === dep._id);
        if (i >= 0) {
          department[i].name = depart.name;
        }
      }));
  }

}
