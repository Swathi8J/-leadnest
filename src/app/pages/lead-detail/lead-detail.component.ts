import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { doc, getDoc } from 'firebase/firestore';
import { Subscription } from 'rxjs';
import { db } from '../../core/firebase.config';
import { LeadService } from '../../core/lead.service';
import { NoteService } from '../../core/note.service';
import { Lead, LeadStage } from '../../models/lead.model';
import { Note } from '../../models/note.model';

const STAGES: LeadStage[] = ['new', 'contacted', 'won', 'lost'];

@Component({
  selector: 'app-lead-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './lead-detail.component.html',
  styleUrl: './lead-detail.component.css',
})
export class LeadDetailComponent implements OnInit, OnDestroy {
  readonly stages = STAGES;
  lead: Lead | null = null;
  notes: Note[] = [];
  newNote = '';

  private sub?: Subscription;
  private leadId!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private leadService: LeadService,
    private noteService: NoteService,
  ) {}

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }
    this.leadId = id;

    const snap = await getDoc(doc(db, 'leads', id));
    if (snap.exists()) {
      const data = snap.data() as Omit<Lead, 'id'>;
      this.lead = { id, ...data };
    }

    this.sub = this.noteService.watchNotes(id).subscribe((notes) => {
      this.notes = notes;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  async moveStage(stage: LeadStage): Promise<void> {
    if (!this.lead || this.lead.stage === stage) {
      return;
    }
    await this.leadService.setStage(this.lead.id, stage);
    this.lead = { ...this.lead, stage };
  }

  async addNote(): Promise<void> {
    const text = this.newNote.trim();
    if (!text) {
      return;
    }
    await this.noteService.addNote({ leadId: this.leadId, text, at: Date.now() });
    this.newNote = '';
  }

  async remove(): Promise<void> {
    if (!this.lead) {
      return;
    }
    if (!confirm(`Delete ${this.lead.name}? This cannot be undone.`)) {
      return;
    }
    await this.leadService.deleteLead(this.lead.id);
    await this.router.navigateByUrl('/');
  }
}
