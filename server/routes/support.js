const express = require('express');
const router = express.Router();
const transporter = require('../config/mailer');

/**
 * @desc    Submit support ticket and send real email
 * @route   POST /api/support/ticket
 */
router.post('/ticket', async (req, res) => {
    console.log('📬 [Support] Ticket submission received:', req.body.email);
    try {
        const { name, email, subject, message } = req.body;
        const ticketId = `FT-${Math.floor(Date.now() / 1000)}`;
        
        const mailOptions = {
            from: process.env.EMAIL_USER, // Must be the authenticated user for Gmail
            to: process.env.EMAIL_USER,   // Sending it to our own support mail
            replyTo: email,               // Allow replying directly to the user
            subject: `[SUPPORT TICKET] ${subject} - From: ${name}`,
            text: `
                New Support Ticket Received:
                ---------------------------
                Name: ${name}
                User Email: ${email}
                Subject: ${subject}
                
                Message:
                ${message}
                ---------------------------
                Ticket ID: ${ticketId}
            `
        };

        // 1. Send actual email to support team
        console.log(`📡 [Support] Attempting to send ticket email to ${process.env.EMAIL_USER}...`);
        try {
            await transporter.sendMail(mailOptions);
            console.log(`✅ [Support] Ticket email sent successfully.`);
        } catch (teamMailError) {
            console.error('❌ [Support] Team Mail Error:', teamMailError.message);
            throw new Error(`Support Team mailbox unreachable: ${teamMailError.message}`);
        }

        // 2. Send acknowledgment email to the user
        const ackMailOptions = {
            from: process.env.EMAIL_USER,
            to: email, // The user's email
            subject: `Acknowledgement: Support Ticket ${ticketId}`,
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background: white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h2 style="color: #6366F1; margin: 0; font-size: 24px;">Support Request Received</h2>
                        <p style="color: #64748B; font-size: 14px; margin-top: 5px;">Ticket ID: ${ticketId}</p>
                    </div>
                    
                    <p>Hi <strong>${name}</strong>,</p>
                    <p>Thank you for reaching out to FintechPro. We've received your message regarding "<strong>${subject}</strong>" and our dedicated support team is already reviewing it.</p>
                    
                    <div style="background: #f8fafc; padding: 20px; border-left: 4px solid #6366F1; margin: 25px 0; border-radius: 4px;">
                        <p style="margin: 0; font-size: 15px; line-height: 1.6;">${message.substring(0, 200)}${message.length > 200 ? '...' : ''}</p>
                    </div>
                    
                    <p style="color: #64748B; font-size: 14px;">We typically respond to all inquiries within 24 business hours. If you have additional details to share, simply reply to this email.</p>
                    
                    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #f1f5f9; text-align: center;">
                        <p style="font-size: 13px; color: #94A3B8; margin: 0;">&copy; 2026 FintechPro. All Rights Reserved.</p>
                    </div>
                </div>
            `
        };

        try {
            await transporter.sendMail(ackMailOptions);
            console.log(`✅ [Support] Acknowledgment email sent to ${email}`);
        } catch (ackError) {
            console.warn('⚠️ [Support] Acknowledgment email failed (User might have provided invalid email):', ackError.message);
        }

        res.json({
            success: true,
            message: 'Support ticket sent successfully! A confirmation email has been sent to you.',
            ticketId: ticketId
        });
    } catch (error) {
        console.error('❌ [Support] Fatal Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Email service failed. This usually means the Gmail App Password is invalid or Google has blocked the connection.',
            error: error.message 
        });
    }
});

module.exports = router;

