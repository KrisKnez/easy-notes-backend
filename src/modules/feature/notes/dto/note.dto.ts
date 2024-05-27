import { Note } from '@prisma/client';

export class NoteDto implements Note {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;

  constructor(init?: Partial<Note>) {
    Object.assign(this, init);
  }

  public static fromEntity(entity: Note): NoteDto {
    return new this({
      id: entity.id,
      title: entity.title,
      content: entity.content,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      userId: entity.userId,
    });
  }
}
