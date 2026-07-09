import { Injectable, NgZone } from '@angular/core';
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { Observable } from 'rxjs';
import { db } from './firebase.config';
import { NewNote, Note } from '../models/note.model';

const NOTES_COLLECTION = 'notes';

@Injectable({ providedIn: 'root' })
export class NoteService {
  constructor(private zone: NgZone) {}

  /** Live stream of notes for a single lead, newest first. */
  watchNotes(leadId: string): Observable<Note[]> {
    return new Observable<Note[]>((subscriber) => {
      const q = query(
        collection(db, NOTES_COLLECTION),
        where('leadId', '==', leadId),
        orderBy('at', 'desc'),
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          this.zone.run(() => {
            const notes: Note[] = snapshot.docs.map((docSnap) => {
              const data = docSnap.data() as Omit<Note, 'id'>;
              return { id: docSnap.id, ...data };
            });
            subscriber.next(notes);
          });
        },
        (error) => subscriber.error(error),
      );

      return () => unsubscribe();
    });
  }

  async addNote(note: NewNote): Promise<void> {
    await addDoc(collection(db, NOTES_COLLECTION), note);
  }
}
