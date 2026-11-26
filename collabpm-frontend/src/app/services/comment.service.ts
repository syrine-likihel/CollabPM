import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private api = 'http://localhost:8080/api/comments';

  constructor(private http: HttpClient) {}

  getByTask(taskId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/task/${taskId}`);
  }

  add(dto: any): Observable<any> {
    return this.http.post<any>(this.api, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}