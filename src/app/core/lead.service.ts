import { Injectable, NgZone } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { Observable } from 'rxjs';
import { db } from './firebase.config';
import { Lead, LeadStage, NewLead } from '../models/lead.model';

const LEADS_COLLECTION = 'leads';

@Injectable({ providedIn: 'root' })
export class LeadService {
  constructor(private zone: NgZone) {}

  /** Live stream of leads owned by the given user, newest first. */
  watchLeads(ownerUid: string): Observable<Lead[]> {
    return new Observable<Lead[]>((subscriber) => {
      const q = query(
        collection(db, LEADS_COLLECTION),
        where('ownerUid', '==', ownerUid),
        orderBy('createdAt', 'desc'),
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          this.zone.run(() => {
            const leads: Lead[] = snapshot.docs.map((docSnap) => {
              const data = docSnap.data() as Omit<Lead, 'id'>;
              return { id: docSnap.id, ...data };
            });
            subscriber.next(leads);
          });
        },
        (error) => subscriber.error(error),
      );

      return () => unsubscribe();
    });
  }

  async createLead(lead: NewLead): Promise<void> {
    await addDoc(collection(db, LEADS_COLLECTION), {
      ...lead,
      createdAt: Date.now(),
    });
  }

  async updateLead(id: string, changes: Partial<NewLead>): Promise<void> {
    await updateDoc(doc(db, LEADS_COLLECTION, id), changes);
  }

  async setStage(id: string, stage: LeadStage): Promise<void> {
    await updateDoc(doc(db, LEADS_COLLECTION, id), { stage });
  }

  async deleteLead(id: string): Promise<void> {
    await deleteDoc(doc(db, LEADS_COLLECTION, id));
  }
}
