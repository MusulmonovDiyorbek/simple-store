// src/common/mail/mail.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { mailerConfig } from '../config/mailer.config';
import * as dotenv from 'dotenv';

// ✅ .env ni erta yuklab olish
dotenv.config();

@Injectable()
export class MailService {
  async sendVerificationEmail(to: string, code: string): Promise<void> {
    try {
      console.log(`📨 Email yuborilmoqda: ${to} | Kod: ${code}`);

      await mailerConfig.sendMail({
        from: process.env.SMTP_FROM || `"My App" <no-reply@myapp.com>`,
        to,
        subject: 'Email tasdiqlash kodi',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto;">
            <h2>Email tasdiqlash</h2>
            <p>Salom, tasdiqlash kodi quyidagicha:</p>
            <h3 style="background: #f4f4f4; padding: 10px; text-align: center;">${code}</h3>
            <p>Bu kod 10 daqiqa ichida amal qiladi.</p>
          </div>
        `,
      });

      console.log(`✅ Email muvaffaqiyatli yuborildi: ${to}`);
    } catch (error) {
      console.error('❌ Email yuborishda xatolik:', error);

      let reason = 'Email yuborishda xatolik yuz berdi';
      if (error.code === 'ECONNREFUSED') {
        reason =
          `SMTP serverga ulanib bo‘lmadi: ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}. ` +
          `Iltimos, server ishlayotganini va port to‘g‘ri ekanini tekshiring.`;
      } else if (error.code === 'EAUTH') {
        reason =
          `SMTP autentifikatsiya xatosi: foydalanuvchi yoki parol noto‘g‘ri. ` +
          `Iltimos, .env fayldagi SMTP_USER va SMTP_PASS qiymatlarini tekshiring.`;
      } else if (error.response) {
        reason = error.response;
      }

      throw new InternalServerErrorException(reason);
    }
  }
}
