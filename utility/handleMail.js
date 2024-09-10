const nodemailer = require('nodemailer');

// Function to send an email with dynamic inputs
async function handleGmail(req, res) {
    // Create a transporter
    let body = '';

    // Listen for data being sent
    req.on('data', chunk => {
        body += chunk;
    });

    req.on('end', async () => {
        const {user, pass, from, to, subject, text, html} = JSON.parse(body);
        let transporter = nodemailer.createTransport({
            service: 'gmail', // Use Gmail
            auth: {
                user: user,  // Gmail account
                pass: pass   // App Password for Gmail (NOT the regular Gmail password)
            }
        });

        // Define mail options
        let mailOptions = {
            from: from,        // Sender address
            to: to,            // Recipient address
            subject: subject,  // Subject line
            text: text,        // Plain text body
            html: html         // HTML body
        };

        await transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.log('Error:', error);
            }
            res.writeHead(500);
            res.end('Message sent: ' + info.response);
        });
    });
}

// Export the function
module.exports = handleGmail;