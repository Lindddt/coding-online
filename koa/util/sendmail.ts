import * as nodemailer from 'nodemailer';
import smtpConfig from '../configs/smtp';
// 开启一个 SMTP 连接池
const transporter = nodemailer.createTransport({
  host: 'smtp.qq.com',
  port: 465,
  secure: true, // secure:true for port 465, secure:false for port 587
  auth: smtpConfig,
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: true,
  },
});

function sendMail(mail: string, code: string, call: (arg0: boolean) => void) {
  // 发送的配置项
  const mailOptions = {
    from: '"codeweb" <1550337293@qq.com>', // 发送方
    to: mail, // 接收者邮箱，多个邮箱用逗号间隔
    subject: '验证码', // 标题
    text: '您的验证码是：' + code, // 文本内容
  };

  // 发送函数
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      call(false);
    } else {
      call(true); // 因为是异步 所有需要回调函数通知成功结果
    }
  });

}

const email = {
  sendMail
};

export default email;
