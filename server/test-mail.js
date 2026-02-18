require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

console.log('Testing connection with:', process.env.EMAIL_USER);

transporter.verify(function(error, success) {
    if (error) {
        console.error('❌ Mailer connection error:', error);
    } else {
        console.log('✅ Mailer is ready');
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'Test Email from FintechPro',
            text: 'This is a test email to verify the mailer configuration.'
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('❌ Send error:', err);
            } else {
                console.log('✅ Email sent:', info.response);
            }
            process.exit();
        });
    }
});
