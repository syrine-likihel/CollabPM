import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MemberService {
  private api = 'http://localhost:8080/api/members';

  constructor(private http: HttpClient) {}

  getByProject(projectId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/project/${projectId}`);
  }

  add(dto: any): Observable<any> {
    return this.http.post<any>(this.api, dto);
  }

  remove(memberId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${memberId}`);
  }
}