import { SetMetadata } from '@nestjs/common';

export const AuditLog = (action: string, entity: string) =>
  SetMetadata('auditLog', { action, entity });
