// src/config/mailer.config.ts
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

// .env faylni yuklash (agar ConfigModule ishlamasa ham)
dotenv.config();

if (!process.env.SMTP_HOST) {
  console.error('❌ SMTP_HOST aniqlanmagan! .env faylini tekshiring.');
}

export const mailerConfig = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465, // 465 bo‘lsa true
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
