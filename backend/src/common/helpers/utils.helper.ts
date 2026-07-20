import { v4 as uuidv4 } from 'uuid';

export class UtilsHelper {
  static generateId(): string {
    return uuidv4();
  }

  static generateTransactionId(): string {
    return `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static generateOTP(length: number = 6): string {
    return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)).toString();
  }

  static maskEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    const maskedLocal = localPart.charAt(0) + '*'.repeat(localPart.length - 2) + localPart.charAt(localPart.length - 1);
    return `${maskedLocal}@${domain}`;
  }

  static maskPhone(phone: string): string {
    return phone.slice(0, 3) + '*'.repeat(phone.length - 6) + phone.slice(-3);
  }

  static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static getErrorMessage(error: any): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'Unknown error';
  }
}
