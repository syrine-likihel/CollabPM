import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {

  private api = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }

  getAvailable(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.api}/available`
    );
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(
      `${this.api}/${id}`
    );
  }

  create(dto: any): Observable<any> {
    return this.http.post<any>(
      this.api,
      dto
    );
  }

  update(id: number, dto: any): Observable<any> {
    return this.http.put<any>(
      `${this.api}/${id}`,
      dto
    );
  }

 updateRole(id: number, role: string): Observable<any> {
  return this.http.put<any>(
    `${this.api}/${id}/role`,
    null,
    {
      params: {
        role: role
      }
    }
  );
}

  delete(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.api}/${id}`
    );
  }
}