// import Mail = require('nodemailer/lib/mailer');
// import * as nodemailer from 'nodemailer';

// import { Inject, Injectable } from '@nestjs/common';
// import emailConfig from 'src/config/emailConfig';
// import { ConfigType } from '@nestjs/config';

// interface EmailOptions {
//   to: string;
//   subject: string;
//   html: string;
// }

// @Injectable()
// export class EmailService {
//   private transporter: Mail;

//   constructor(
//     @Inject(emailConfig.KEY) private config: ConfigType<typeof emailConfig>
//   ) {
//     this.transporter = nodemailer.createTransport({
//       service: config.service,  
//       auth: {
//         user: config.auth.user,
//         pass: config.auth.pass
//       }
//     });
//     console.log('email config:', this.config); 
//   }

//   async sendMemberJoinVerification(emailAddress: string, signupVerifyToken: string) {
//     const baseUrl = this.config.baseUrl;
//     const url = `${baseUrl}/user/email-verify?signupVerifyToken=${signupVerifyToken}`;
//     console.log('email to: ', emailAddress);
//     const mailOptions: EmailOptions = {
//       to: emailAddress,
//       subject: 'BBOSONG 회원가입 이메일 인증',
//       html: `
//         <div style="max-width:400px;margin:40px auto;padding:32px 24px;background:#fff;border-radius:12px;box-shadow:0 2px 8px #eee;text-align:center;font-family:sans-serif;">
//           <h2 style="color:#4a90e2;">BBOSONG 회원가입 인증</h2>
//           <p style="font-size:16px;color:#333;">아래 버튼을 클릭하시면<br>이메일 인증이 완료됩니다.</p>
//           <a href="${url}" style="display:inline-block;margin:24px 0;padding:12px 32px;background:#4a90e2;color:#fff;text-decoration:none;border-radius:6px;font-size:18px;font-weight:bold;">이메일 인증하기</a>
//           <p style="font-size:12px;color:#888;">본인이 요청하지 않았다면 이 메일을 무시하세요.</p>
//         </div>
//       `
//     }
//     return await this.transporter.sendMail(mailOptions);
//   }
// }

import { Injectable, Inject } from '@nestjs/common';
import { Resend } from 'resend';
import emailConfig from 'src/config/emailConfig';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor(
    @Inject(emailConfig.KEY) private config: ConfigType<typeof emailConfig>
  ) {
    this.resend = new Resend(this.config.apiKey);
  }

  async sendMemberJoinVerification(emailAddress: string, signupVerifyToken: string) {
    const url = `${this.config.baseUrl}/user/email-verify?signupVerifyToken=${signupVerifyToken}`;

    try {
      const result = await this.resend.emails.send({
        from: 'onboarding@resend.dev', // Resend에서 승인된 이메일
        to: emailAddress,
        subject: 'BBOSONG 회원가입 이메일 인증',
        html: `
          <div style="max-width:400px;margin:40px auto;padding:32px 24px;background:#fff;border-radius:12px;box-shadow:0 2px 8px #eee;text-align:center;font-family:sans-serif;">
            <h2 style="color:#4a90e2;">BBOSONG 회원가입 인증</h2>
            <p style="font-size:16px;color:#333;">아래 버튼을 클릭하시면<br>이메일 인증이 완료됩니다.</p>
            <a href="${url}" style="display:inline-block;margin:24px 0;padding:12px 32px;background:#4a90e2;color:#fff;text-decoration:none;border-radius:6px;font-size:18px;font-weight:bold;">이메일 인증하기</a>
            <p style="font-size:12px;color:#888;">본인이 요청하지 않았다면 이 메일을 무시하세요.</p>
          </div>
        `,
      });

      console.log('✅ 메일 발송 성공:', result);
      return result;
    } catch (err) {
      console.error('❌ 메일 발송 실패:', err);
      throw err;
    }
  }
}

