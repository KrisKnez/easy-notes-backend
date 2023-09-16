import { Note } from '@prisma/client';

export class RetrieveNoteDto implements Note {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
}
