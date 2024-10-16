// document.model.ts
export interface Document {
  id: number;
  name: string;
  subject: string;
  state: string;
  fromAddress: string;
  toAddress: string;
  date: string;
  caseNumber: string;
  content?: string; // Optional if not always present
  traduction?: string; // Optional if not always present
  visitCounter: number;
  pagesCount?: number; // Optional if not always present
}