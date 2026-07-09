import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { doc, getDoc } from 'firebase/firestore';
import { AuthService } from '../../core/auth.service';
import { db } from '../../core/firebase.config';
import { LeadService } from '../../core/lead.service';
import { Lead, LeadStage, NewLead } from '../../models/lead.model';

const STAGES: LeadStage[] = ['new', 'contacted', 'won', 'lost'];

@Component({
  selector: 'app-lead-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './lead-form.component.html',
  styleUrl: './lead-form.component.css',
})
export class LeadFormComponent implements OnInit {
  readonly stages = STAGES;
  leadId: string | null = null;
  name = '';
  company = '';
  contact = '';
  stage: LeadStage = 'new';
  saving = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private leadService: LeadService,
    private authService: AuthService,
  ) {}

  get isEdit(): boolean {
    return this.leadId !== null;
  }

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }
    this.leadId = id;
    const snap = await getDoc(doc(db, 'leads', id));
    if (snap.exists()) {
      const data = snap.data() as Omit<Lead, 'id'>;
      this.name = data.name;
      this.company = data.company;
      this.contact = data.contact;
      this.stage = data.stage;
    }
  }

  async submit(): Promise<void> {
    const uid = this.authService.currentUser?.uid;
    if (!uid) {
      return;
    }
    this.error = null;
    this.saving = true;
    try {
      const payload: NewLead = {
        name: this.name.trim(),
        company: this.company.trim(),
        contact: this.contact.trim(),
        stage: this.stage,
        ownerUid: uid,
      };
      if (this.isEdit && this.leadId) {
        await this.leadService.updateLead(this.leadId, payload);
      } else {
        await this.leadService.createLead(payload);
      }
      await this.router.navigateByUrl('/');
    } catch {
      this.error = 'Could not save this lead. Try again.';
    } finally {
      this.saving = false;
    }
  }
}
