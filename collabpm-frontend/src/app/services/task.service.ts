import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private api = 'http://localhost:8080/api/tasks';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }

  getByProject(projectId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/project/${projectId}`);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.api}/${id}`);
  }

  getKanban(projectId: number): Observable<any> {
    return this.http.get<any>(`${this.api}/kanban/${projectId}`);
  }

  create(dto: any): Observable<any> {
    return this.http.post<any>(this.api, dto);
  }

  update(id: number, dto: any): Observable<any> {
    return this.http.put<any>(`${this.api}/${id}`, dto);
  }

  changeStatus(id: number, status: string): Observable<any> {
    return this.http.patch<any>(`${this.api}/${id}/status?status=${status}`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}