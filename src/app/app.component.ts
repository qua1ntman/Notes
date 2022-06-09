import { Component, OnInit } from '@angular/core';
import { retry } from 'rxjs';
import { AppDataService } from './app-data.service';
import { Note } from './interfaces/note';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  newNoteText = '';
  notes!: Note[];

  noteEdit!: Note
  textEdit = ''
  isEditorOpen = false;
  isSearchTags = false

  constructor(private dataService: AppDataService){};

  ngOnInit(): void {
    this.getNotes()
  };

  getNotes() {
    this.dataService.getData()
      .pipe(retry(3))
      .subscribe(data => {
        this.notes = JSON.parse(data).notes
      });
  }

  findTags(text: string) {
    return text.split(' ')
    .map(item => item.replace(/[^a-zа-яё#0-9]/gi, '').toLocaleLowerCase())
    .filter(item => item.startsWith('#'))
  };

  addNote() {
    let id: number|string = (+this.notes[this.notes.length-1].id+1).toString();

    let tags: string[] = this.findTags(this.newNoteText);

    let text = this.newNoteText;
    let newNote: Note = {id, text, tags};
    this.notes.push(newNote);

    this.dataService.postData(this.notes);
    this.newNoteText = ''
  };

  findByTags() {
    let tags = this.findTags(this.newNoteText)
    tags.forEach(tag => {
      this.notes = this.notes.filter(note => note.tags.includes(tag))
    })
  }

  editNote(id: string, text: string) {
    this.notes = this.notes.map(note => {
      if (note.id === id) {
        note.text = text;
        note.tags = this.findTags(text);
      }
      return note
    })
    this.dataService.postData(this.notes);
  }

  deleteNote(id: string) {
    this.notes = this.notes.filter(note => note.id !== id)
    this.dataService.postData(this.notes);
  }

  sortByTag(tag: string) {
    this.notes = this.notes.filter(note => note.tags.includes(tag))
  }

  openEditor(note: Note) {
    this.noteEdit = note
    this.textEdit = note.text
    this.isEditorOpen = true
  }
  
  closeEditor() {
    this.editNote(this.noteEdit.id, this.textEdit)
    this.isEditorOpen = false
  }

  trackByFn(index: any, item: any) {
    return index;
  }
}
