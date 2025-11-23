const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001; // Or any other port

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/send-email', async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    // Create a test account on Ethereal
    let testAccount = await nodemailer.createTestAccount();

    // Create a transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    // Send mail with defined transport object
    let info = await transporter.sendMail({
      from: `"${name}" <${email}>`, // sender address
      to: 'a.rosero.official@gmail.com', // list of receivers - REPLACE with the actual recipient
      subject: subject, // Subject line
      text: message, // plain text body
      html: `<b>From:</b> ${name} (${email})<br/><b>Message:</b><br/>${message}`, // html body
    });

    console.log('Message sent: %s', info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    res.status(200).json({
      message: 'Email sent successfully!',
      previewUrl: nodemailer.getTestMessageUrl(info)
    });
  } catch (error) {
    console.error('Error sending email:', error);
    console.error("Error:", error.message);
    res.status(500).json({ message: 'An error occurred while sending the email.' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
