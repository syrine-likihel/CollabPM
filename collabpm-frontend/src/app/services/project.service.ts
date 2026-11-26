import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private api = 'http://localhost:8080/api/projects';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.api}/${id}`);
  }

  create(dto: any, ownerId: number): Observable<any> {
    return this.http.post<any>(`${this.api}?ownerId=${ownerId}`, dto);
  }

  update(id: number, dto: any): Observable<any> {
    return this.http.put<any>(`${this.api}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}