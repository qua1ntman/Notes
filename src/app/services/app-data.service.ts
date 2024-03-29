import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Note } from '../interfaces/note';

@Injectable({
  providedIn: 'root'
})
export class AppDataService {
  URL = 'https://morning-bastion-67152.herokuapp.com/notes'
  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    return this.http.get<any>(this.URL)
  }

  postData(data: Note[]) {
    this.http.post(this.URL, {notes: data}).subscribe(data => console.dir(data))
  }

}
