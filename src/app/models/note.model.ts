export interface Note {
  id: string;
  leadId: string;
  text: string;
  at: number;
}

export type NewNote = Omit<Note, 'id'>;
