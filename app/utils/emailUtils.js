const nodemailer = require('nodemailer');

/**
 * Sends an email using the provided details.
 * 
 * @param {string} recipient - The email address of the recipient.
 * @param {string} subject - The subject line of the email.
 * @param {string} textBody - The plain text content of the email.
 * @param {string} htmlBody - The HTML content of the email.
 */
async function sendEmail(recipient, subject, textBody, htmlBody) {
    // Create a transporter using SMTP server details
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAILNAME,
            pass: process.env.PASSWORD
        }
    });
    console.log(process.env.EMAILNAME);
    console.log(process.env.PASSWORD);

    // Email options
    let mailOptions = {
        from: `"Trường PTTH MNO" <${process.env.EMAILNAME}>`,
        to: recipient,
        subject: subject,
        text: textBody,
        html: htmlBody
    };

    // Attempt to send the email
    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return info;
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
}

module.exports = { sendEmail };
