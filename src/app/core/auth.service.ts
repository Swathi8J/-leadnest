import { Injectable } from '@angular/core';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { auth } from './firebase.config';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly userSubject = new BehaviorSubject<User | null>(null);
  readonly user$: Observable<User | null> = this.userSubject.asObservable();

  private initialized = false;
  private readonly readyPromise: Promise<void>;

  constructor() {
    this.readyPromise = new Promise<void>((resolve) => {
      onAuthStateChanged(auth, (user) => {
        this.userSubject.next(user);
        if (!this.initialized) {
          this.initialized = true;
          resolve();
        }
      });
    });
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  /** Resolves once Firebase has reported the initial auth state. */
  whenReady(): Promise<void> {
    return this.readyPromise;
  }

  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async logout(): Promise<void> {
    await signOut(auth);
  }
}
