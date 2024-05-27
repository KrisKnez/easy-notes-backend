import { Contact } from '@prisma/client';

export class RetrieveContactDto implements Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  instagram: string;
  note: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
}
