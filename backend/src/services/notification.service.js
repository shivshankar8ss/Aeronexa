const transporter = require("../config/email");

exports.sendEmailAlert = async ({ to, subject, message }) => {
  try {
    await transporter.sendMail({
      from: `"Pollution Alert System" <${process.env.ALERT_EMAIL}>`,
      to,
      subject,
      html: `
        <h2>🚨 Pollution Alert</h2>
        <p>${message}</p>
        <p><b>Stay safe. Reduce outdoor exposure.</b></p>
      `,
    });
  } catch (err) {
    console.error("Email failed:", err.message);
  }
};
