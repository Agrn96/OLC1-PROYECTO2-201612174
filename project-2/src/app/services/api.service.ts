import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IReqInput } from './IReqInput';
import { IResImageOut } from './IResImageOut';
import { IResOutput } from './IResOutput';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  public getApiData(input: IReqInput): Observable<IResOutput> {
    return this.http.post<IResOutput>(`${environment.API}/parse`, input);
  }

  public getImage(input: IReqInput): Observable<IResImageOut> {
    return this.http.post<IResImageOut>(`${environment.API}/image`, input);
  }
}
