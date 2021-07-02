import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable, throwError as observableThrowError, firstValueFrom } from 'rxjs';
import { catchError, map, take, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { environment } from '../../../environments/environment';
import { constants } from '../strings/constants';
import { UIProject } from '../models/ui-project';
import { ErrorBase } from '../models/error-base';

export class AsyncApi {
  static appVersion: string;
  static redirectTo: string;
  defaultErrorMessage: ErrorBase;

  constructor(
    public http: HttpClient,
    public router: Router,
    public toastr: ToastrService,
    public resourceUrl: string,
    private readonly uiProject: UIProject) {

    this.resourceUrl = environment.baseUrl + this.resourceUrl;

    this.defaultErrorMessage = <ErrorBase>{
      name: 'Error',
      message: 'Oops, something went wrong!',
      displayMessage: 'Error: Oops, something went wrong!'
    };
  }

  static clearLocalStorage() {
    localStorage.removeItem(environment.userKey);
  }

  static getAccessToken(): string | null {
    const user = JSON.parse(localStorage.getItem(environment.userKey));
    return user ? user.accessToken : null;
  }

  static getAuthorizationHeaders(): any {
    const token = AsyncApi.getAccessToken();
    if (!token) {
      return {};
    }

    return {
      'Authorization': `Bearer ${ token }`
    };
  }

  static appendQuery(url: string, x: any) {
    let query = '';
    for (const key in x) {
      if (x.hasOwnProperty(key) && x[key] != null) {
        if (Array.isArray(x[key])) {
          for (let i = 0; i < x[key].length; i++) {
            query += query.length === 0 ? '?' : '&';
            query += `${ key }=${ encodeURIComponent(x[key][i]) }`;
          }
        } else {
          query += query.length === 0 ? '?' : '&';
          query += `${ key }=${ encodeURIComponent(x[key]) }`;
        }
      }
    }
    return url + query;
  }

  static getRequestOptions(options?: any, excludeAuthenticationHeaders = false): any {
    const headers = Object.assign({
      'Content-Type': 'application/json'
    }, options);

    if (!excludeAuthenticationHeaders) {
      Object.assign(headers, AsyncApi.getAuthorizationHeaders());
    }

    return { headers: new HttpHeaders(headers), observe: 'response' };
  }

  // error processing
  handleError(error: HttpErrorResponse) {
    const errorData = error.error || this.defaultErrorMessage;

    // authentication or forbidden error
    if (error.status === 403) {
      this.toastr.warning('Your session expired, please log in again.');
      AsyncApi.clearLocalStorage();
      this.router.navigate(['/unauthorized'], { queryParams: { 'redirectTo': this.router.url } });
    } else if (error.status === 503) {
      this.toastr.warning(errorData.message, errorData.name);
    }

    return observableThrowError(errorData);
  }

  handleHeaders(response: HttpResponse<any>): void {
    if (this.uiProject === UIProject.ADMIN_TOOL) {
      this.handleHeader(response, constants.HEADERS.ADMIN_VERSION);
    } else if (this.uiProject === UIProject.PLATFORM_DASHBOARD) {
      this.handleHeader(response, constants.HEADERS.PLATFORM_VERSION);
    }
  }

  displayError(error: ErrorBase) {
    const err = typeof error === 'string' ? JSON.parse(error) : error;
    this.toastr.error(err.message, err.name);
  }

  get(query?: any, resourcePath = '', excludeAuthenticationHeaders = false, options = null): Observable<any> {
    return this.http
      .get<any>(
        AsyncApi.appendQuery(`${ this.resourceUrl + resourcePath }`, query),
        AsyncApi.getRequestOptions(options, excludeAuthenticationHeaders)
      ).pipe(
        tap(this.handleHeaders.bind(this)),
        map((response: HttpResponse<any>) => response.body),
        catchError(error => this.handleError(error))
      );
  }

  async getAsync(query?: any, resourcePath = '', excludeAuthenticationHeaders = false, options = null): Promise<any> {
    return firstValueFrom(this.get(query, resourcePath, excludeAuthenticationHeaders, options));
  }

  post(data: any, resourcePath = '', excludeAuthenticationHeaders = false, options = null): Observable<any> {
    return this.http
      .post<any>(
        `${ this.resourceUrl + resourcePath }`,
        data,
        AsyncApi.getRequestOptions(options, excludeAuthenticationHeaders)
      ).pipe(
        tap(this.handleHeaders.bind(this)),
        map((response: HttpResponse<any>) => response.body),
        catchError(error => this.handleError(error))
      );
  }

  async postAsync(data: any, resourcePath = '', excludeAuthenticationHeaders = false, options = null): Promise<any> {
    return firstValueFrom(this.post(data, resourcePath, excludeAuthenticationHeaders, options));
  }

  put(data: any, resourcePath = '', excludeAuthenticationHeaders = false, options = null): Observable<any> {
    return this.http
      .put<any>(
        `${ this.resourceUrl + resourcePath }`,
        data,
        AsyncApi.getRequestOptions(options, excludeAuthenticationHeaders)
      ).pipe(
        tap(this.handleHeaders.bind(this)),
        map((response: HttpResponse<any>) => response.body),
        catchError(error => this.handleError(error))
      );
  }

  async putAsync(data: any, resourcePath = '', excludeAuthenticationHeaders = false, options = null): Promise<any> {
    return firstValueFrom(this.put(data, resourcePath, excludeAuthenticationHeaders, options));
  }

  delete(resourcePath = '', excludeAuthenticationHeaders = false, options = null): Observable<any> {
    return this.http
      .delete<any>(
        `${ this.resourceUrl + resourcePath }`,
        AsyncApi.getRequestOptions(options, excludeAuthenticationHeaders)
      ).pipe(
        tap(this.handleHeaders.bind(this)),
        map((response: HttpResponse<any>) => response.body),
        catchError(error => this.handleError(error))
      );
  }

  async deleteAsync(resourcePath = '', excludeAuthenticationHeaders = false, options = null): Promise<any> {
    return firstValueFrom(this.delete(resourcePath, excludeAuthenticationHeaders, options));
  }

  upload(resourcePath = '', query: any, files: Blob[], fileNames: string[]): Observable<any> {
    return new Observable(observer => {
      const formData: FormData = new FormData(),
        xhr: XMLHttpRequest = new XMLHttpRequest(),
        token: string = AsyncApi.getAccessToken();

      for (let i = 0; i < files.length; i++) {
        formData.append('file', files[i], fileNames[i]);
      }
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            observer.next(JSON.parse(xhr.response));
            observer.complete();
          } else {
            observer.error(xhr.response);
          }
        }
      };

      xhr.upload.onprogress = () => {
      };
      xhr.open('POST', AsyncApi.appendQuery(`${ this.resourceUrl + resourcePath }`, query), true);
      xhr.setRequestHeader('Authorization', `Bearer ${ token }`);
      xhr.send(formData);
    });
  }

  async uploadAsync(resourcePath = '', query: any, files: Blob[], fileNames: string[]): Promise<any> {
    return firstValueFrom(this.upload(resourcePath, query, files, fileNames));
  }

  private handleHeader(response: HttpResponse<any>, header: string) {
    if (response.headers.has(header)) {
      const responseHeader = response.headers.get(header);
      if (!AsyncApi.appVersion) {
        AsyncApi.appVersion = responseHeader !== '' ? responseHeader : null;
      } else if (responseHeader !== AsyncApi.appVersion) {
        this.toastr.warning(constants.MESSAGES.NEW_VERSION_RELEASED,
          constants.MESSAGES.NOTICE,
          {
            disableTimeOut: true,
            tapToDismiss: false
          }).onTap.pipe(take(1)).subscribe(() => window.location.reload());
      }
    }
  }
}
