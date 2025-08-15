import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  providers: [MailService],
  exports: [MailService], // ✅ boshqa modullar foydalanishi uchun eksport qilamiz
})
export class MailModule {}
