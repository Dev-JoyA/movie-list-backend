import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.PASSWORD,
    },
});

/**
 * Sends an email to the given recipient.
 * @param {string} recipient - The recipient's email address.
 * @param {string} subject - The email subject.
 * @param {string} text - The email body text.
 */
export const sendEmail = async (recipient, subject, text) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: recipient,
            subject,
            text,
        };

        await transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error("Error sending email:", err.message);
            } else {
                console.log("Email sent:", info.response);
            }
        });
        
        console.log(`Email sent to ${recipient}`);
    } catch (error) {
        console.error("Error sending email: ", error.message);
        throw new Error("Email could not be sent");
    }
};
