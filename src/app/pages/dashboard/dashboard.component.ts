import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { LeadService } from '../../core/lead.service';
import { Lead, LeadStage } from '../../models/lead.model';

const STAGES: LeadStage[] = ['new', 'contacted', 'won', 'lost'];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  readonly stages = STAGES;
  leads: Lead[] = [];
  searchTerm = '';
  stageFilter: LeadStage | 'all' = 'all';

  private sub?: Subscription;

  constructor(private leadService: LeadService, private authService: AuthService) {}

  ngOnInit(): void {
    const uid = this.authService.currentUser?.uid;
    if (!uid) {
      return;
    }
    this.sub = this.leadService.watchLeads(uid).subscribe((leads) => {
      this.leads = leads;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  countFor(stage: LeadStage): number {
    return this.leads.filter((lead) => lead.stage === stage).length;
  }

  get filteredLeads(): Lead[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.leads.filter((lead) => {
      const matchesStage = this.stageFilter === 'all' || lead.stage === this.stageFilter;
      const matchesTerm =
        !term ||
        lead.name.toLowerCase().includes(term) ||
        lead.company.toLowerCase().includes(term);
      return matchesStage && matchesTerm;
    });
  }

  async moveStage(lead: Lead, stage: LeadStage): Promise<void> {
    if (lead.stage === stage) {
      return;
    }
    await this.leadService.setStage(lead.id, stage);
  }

  async remove(lead: Lead): Promise<void> {
    if (!confirm(`Delete ${lead.name}? This cannot be undone.`)) {
      return;
    }
    await this.leadService.deleteLead(lead.id);
  }
}
