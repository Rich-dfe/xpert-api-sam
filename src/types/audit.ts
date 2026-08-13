export interface AuditRecord {
  loggerId: string;
  loggerUid: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  data: Record<string, unknown>;
}