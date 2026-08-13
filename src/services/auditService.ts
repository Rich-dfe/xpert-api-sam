import * as auditRepository from "../repositories/auditRepository";
import { AuditRecord } from "../types/audit";

export async function writeAudit(record: AuditRecord) {
    const auditRecord = {
    ...record,
    logDateTime: Math.floor(Date.now()),
    loggerUid: String(record.loggerUid),
  };

  console.log('IN SERVICE',auditRecord);
  //return true;
  return auditRepository.saveAuditRecord(auditRecord);
}