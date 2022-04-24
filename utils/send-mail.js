import dotenv from 'dotenv';
dotenv.config();

import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.EMAIL_API_KEY);

const sendEmail = options => {
  const mailOptions = {
    from: process.env.EMAIL_SENDER_ADDRESS,
    to: options.to,
    subject: options.subject,
    html: `
            <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: teal;">${options.txt}</h2>
            <p>환영합니다! 버튼을 클릭해 ${options.txt}을 완료해주세요.
            </p>
            
            <a href=${options.url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${options.txt}</a>
        
            <p>버튼이 동작하지 않을 시 아래의 링크로 접속해주세요.</p>
        
            <div><a href=${options.url}>${options.url}</a></div>
            </div>
        `,
  };

  sgMail.send(mailOptions, (err, info) => {
    if (err) {
      console.log(err.response.body.errors);
      return err;
    } else {
      // console.log(info);
      return info;
    }
  });
};

export default sendEmail;
