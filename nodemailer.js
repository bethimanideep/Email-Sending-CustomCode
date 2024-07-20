const nodemailer = require('nodemailer');
const USERNAME = 'bethimanideep@gmail.com';
const PASSWORD = 'vhgrppebffryujcj';
const FROM_EMAIL = USERNAME;
const TO_EMAILS = Array(30).fill('tepihep758@ikangou.com'); // Send to the same email 11 times

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: USERNAME,
        pass: PASSWORD
    },
    // pool: true, // Enable connection pooling
    // maxConnections: 5, // Adjust max connections as needed
});

async function sendEmails() {
    const startTime = process.hrtime(); // Start timer

    const sendMailPromises = TO_EMAILS.map(recipient => {
        const mailOptions = {
            from: FROM_EMAIL,
            to: recipient,
            subject: 'SMTP test from smtp.gmail.com',
            text: 'Test message'
        };

        return transporter.sendMail(mailOptions);
    });

    try {
        await Promise.all(sendMailPromises); // Send all emails concurrently
        const endTime = process.hrtime(startTime); // End timer
        const duration = endTime[0] + endTime[1] / 1e9; // Calculate duration in seconds
        console.log(`All emails sent in ${duration.toFixed(3)} seconds`);
    } catch (error) {
        console.error('Error sending emails:', error);
    } finally {
        transporter.close(); // Close the connection pool
    }
}

sendEmails();
