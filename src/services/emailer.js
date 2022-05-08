const nodemailer = require("nodemailer");

exports.sendMail = async (_to, _subject, _body) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: process.env.SMTP_PORT,
      secure: Boolean(process.env.IS_TLS),
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASSWORD,
      },
    });

    let info = await transporter.sendMail({
      from: "youremail@mail.com",
      to: _to, // list of receivers
      subject: _subject, // Subject line
      html: `</HTML>${_body}</HTML>`, // html body
    });

    return true;
  } catch (error) {
    console.error("ERROR SENDING EMAIL: ", error);
    return false;
  }
};
