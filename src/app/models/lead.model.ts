export type LeadStage = 'new' | 'contacted' | 'won' | 'lost';

export interface Lead {
  id: string;
  name: string;
  company: string;
  contact: string;
  stage: LeadStage;
  ownerUid: string;
  createdAt?: number;
}

export type NewLead = Omit<Lead, 'id' | 'createdAt'>;
