import { Injectable } from '@nestjs/common';
import { AuditEvent, AuditEventType } from './audit.types';

function uid(prefix = 'evt') {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

@Injectable()
export class AuditService {
  private readonly events: AuditEvent[] = [];

  record(noteId: string, type: AuditEventType, meta?: Record<string, unknown>) {
    const event: AuditEvent = {
      id: uid(),
      noteId,
      type,
      at: new Date().toISOString(),
      meta,
    };
    this.events.unshift(event);
    return event;
  }

  list(noteId?: string) {
    if (!noteId) return this.events;
    return this.events.filter((e) => e.noteId === noteId);
  }
}
