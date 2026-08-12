export interface AuditRecord {
  loggerUid: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  data: Record<string, unknown>;
}