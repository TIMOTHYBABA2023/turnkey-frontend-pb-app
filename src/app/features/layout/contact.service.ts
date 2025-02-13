import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import {
  ApiResponse,
  ContactResponseData,
  Data,
  NewContactRequest,
  UpdateContactRequest,
} from '../components/row/types';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private apiUrl = 'http://localhost:8080/api/contacts';

  constructor(private http: HttpClient) {}

  getContacts(): Observable<ApiResponse<Data>> {
    return this.http.get<ApiResponse<Data>>(`${this.apiUrl}/allSortedContacts`);
  }
  getContactById(id: number): Observable<ApiResponse<ContactResponseData>> {
    return this.http.get<ApiResponse<ContactResponseData>>(
      `${this.apiUrl}/${id}`,
    );
  }

  getContactCount(): Observable<{
    message: string;
    data: number;
    success: boolean;
    statusCode: number;
  }> {
    return this.http
      .get<{
        message: string;
        data: number;
        success: boolean;
        statusCode: number;
      }>(`${this.apiUrl}/count`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching contact count:', error);
          return of({
            message: 'Failed to fetch contact count',
            data: 0,
            success: false,
            statusCode: error.status || 500,
          });
        }),
      );
  }

  updateContact(
    id: number,
    contact: UpdateContactRequest,
  ): Observable<ApiResponse<ContactResponseData>> {
    return this.http.put<ApiResponse<ContactResponseData>>(
      `${this.apiUrl}/${id}`,
      contact,
    );
  }

  createContact(
    contact: NewContactRequest,
  ): Observable<ApiResponse<ContactResponseData>> {
    return this.http.post<ApiResponse<ContactResponseData>>(
      this.apiUrl,
      contact,
    );
  }

  deleteContact(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  bulkDeleteContacts(contactIds: number[]): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/bulk-delete`, {
      contactIds,
    });
  }

  searchContacts(
    keyword: string,
    page = 0,
    size = 10,
  ): Observable<ApiResponse<ContactResponseData>> {
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ApiResponse<ContactResponseData>>(
      `${this.apiUrl}/search`,
      { params },
    );
  }

  toggleFavorite(
    contactIds: number,
  ): Observable<ApiResponse<ContactResponseData>> {
    return this.http.post<ApiResponse<ContactResponseData>>(
      `${this.apiUrl}/toggleIsFavorite`,
      null,
      {
        params: new HttpParams().set('contactIds', contactIds.toString()),
      },
    );
  }

  getFavoriteContacts(
    page = 0,
    size = 10,
  ): Observable<ApiResponse<ContactResponseData>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ApiResponse<ContactResponseData>>(
      `${this.apiUrl}/favorites`,
      { params },
    );
  }

  importContacts(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/import`, formData, {
      responseType: 'text',
    });
  }

  exportContacts(): Observable<string> {
    return this.http.get(`${this.apiUrl}/export`, {
      responseType: 'text',
      headers: { Accept: 'text/csv' },
    });
  }
}
