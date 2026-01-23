import nodemailer from 'nodemailer';
import { BCC,EMAIL_OBJ } from '../core/config';

export interface EmailData {
  email: string;
  subject: string;
  text?: string;
  html?: string;
  headers?: any;
  cc?: any;
  bcc?: any;
  companyId?: any;
  attachments?: {
    filename: string;
    path?: string;       
    content?: any;       
    contentType?: string;
  }[];
}

export class EmailService {
  static async sendEmail(data: EmailData) {
    return new Promise(async (resolve, reject) => {
      let transporter = nodemailer.createTransport({
        host:EMAIL_OBJ.SMTP_HOST,
        port:EMAIL_OBJ.SMTP_PORT,
        pool: true,
        tls: {
          rejectUnauthorized: false,
        },
        auth: {
          user: EMAIL_OBJ.SMTP_USER,
          pass: EMAIL_OBJ.SMTP_PASSWORD,
        },
        logger: false,
      });
      transporter.sendMail(
        {
          from:EMAIL_OBJ.FROM_ADDRESS,
          to:data.email,
          cc: data.cc || [],
          bcc: BCC,
          subject: data.subject,
          text: data.text,
          html: data.html,
          headers: data.headers,
          attachments: data.attachments || []
        },
        (err, info) => {
          if (err) return reject(err);
          resolve(info.response);
        }
      );
    });
  }
}
