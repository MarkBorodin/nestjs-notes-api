export type AuditEventType =
  | 'NOTE_PUBLISHED'
  | 'NOTE_UNPUBLISHED'
  | 'NOTE_DELETED';

export type AuditEvent = {
  id: string;
  noteId: string;
  type: AuditEventType;
  at: string;
  meta?: Record<string, unknown>;
};
