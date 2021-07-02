import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Observable, firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { AsyncApi } from './async-api';
import { UIProject } from '../models/ui-project';

export interface IPaginatedData<T> {
  records: T[];
  totalRecords: number;
}

export class AsyncCRUD<T> extends AsyncApi {

  constructor(
    http: HttpClient,
    router: Router,
    toastr: ToastrService,
    resourceUrl: string,
    uiProject: UIProject) {
    super(http, router, toastr, resourceUrl, uiProject);
  }

  // Generic methods
  // Get by id
  read(id: string, resourcePath = '', params?: any): Observable<T> {
    return this.get(params, `${ resourcePath }/${ id }`);
  }

  async readAsync(id: string, resourcePath = '', params?: any): Promise<T> {
    return firstValueFrom(this.read(id, resourcePath, params));
  }

  // Insert
  create(data: T, resourcePath = ''): Observable<T> {
    return this.post(data, resourcePath);
  }

  async createAsync(data: T, resourcePath = ''): Promise<T> {
    return firstValueFrom(this.create(data, resourcePath));
  }

  // Update
  update(id: string, data: T, resourcePath = ''): Observable<T> {
    return this.put(data, `${ resourcePath }/${ id }`);
  }

  async updateAsync(id: string, data: T, resourcePath = ''): Promise<T> {
    return firstValueFrom(this.update(id, data, resourcePath));
  }

  // Remove
  remove(id: string, resourcePath = ''): Observable<T> {
    return this.delete(`${ resourcePath }/${ id }`);
  }

  async removeAsync(id: string, resourcePath = ''): Promise<T> {
    return firstValueFrom(this.remove(id, resourcePath));
  }

  // Read
  query(query?: any, resourcePath = ''): Observable<T[]> {
    return this.get(query, resourcePath);
  }

  async queryAsync(query?: any, resourcePath = ''): Promise<T[]> {
    return firstValueFrom(this.query(query, resourcePath));
  }

  // Read
  queryPaginated(query?: any, resourcePath = ''): Observable<IPaginatedData<T>> {
    return this.get(query, resourcePath);
  }

  async queryPaginatedAsync(query?: any, resourcePath = ''): Promise<IPaginatedData<T>> {
    return firstValueFrom(this.queryPaginated(query, resourcePath));
  }
}
