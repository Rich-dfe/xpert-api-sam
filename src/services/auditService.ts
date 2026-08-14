import * as auditRepository from "../repositories/auditRepository";
import { AuditRecord } from "../types/audit";

export async function writeAudit(record: AuditRecord) {
    const ttlTargetDate = new Date();
    ttlTargetDate.setFullYear(ttlTargetDate.getFullYear() + 2);

    const auditRecord = {
    ...record,
    logDateTime: Math.floor(Date.now()/1000),
    loggerUid: String(record.loggerUid),
    ttlDate: Math.floor(ttlTargetDate.getTime()/1000)
  };

  console.log('IN SERVICE',auditRecord);
  //return true;
  return auditRepository.saveAuditRecord(auditRecord);
}