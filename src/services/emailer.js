const nodemailer = require("nodemailer");

function parseBoolean(value) {
  return String(value).trim().toLowerCase() === "true";
}

// Function to send an email
exports.sendMail = async (to, subject, body) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: Number.parseInt(process.env.SMTP_PORT, 10),
      secure: parseBoolean(process.env.IS_TLS),
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to: to,
      subject: subject,
      html: `<html>${body}</html>`, // Wrap the HTML content in <html> tags
    });

    return true; // Email sent successfully
  } catch (error) {
    console.error("ERROR SENDING EMAIL: ", error);
    return false; // Email sending failed
  }
};
