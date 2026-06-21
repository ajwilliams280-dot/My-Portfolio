import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { email, buyerName, beatTitle, pdfBase64, audioUrl } = await req.json();

    // Check if nodemailer is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("SMTP credentials not configured. Email will not be sent.");
      return NextResponse.json({ success: true, warning: 'SMTP not configured' });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Remove the data URI prefix to get pure base64
    const base64Data = pdfBase64.split('base64,')[1];

    const mailOptions = {
      from: `"Spice (Alton's World)" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Your Beat License for "${beatTitle}"`,
      text: `Hello ${buyerName},\n\nThank you for purchasing the beat "${beatTitle}".\n\nYou can download your high-quality beat file here:\n${audioUrl || "Link unavailable. Please download directly from the success page."}\n\nAttached is your official License Agreement.\n\nBest regards,\nSpice (Alton's World)`,
      attachments: [
        {
          filename: `${beatTitle.replace(/\s+/g, '_')}_License.pdf`,
          content: base64Data,
          encoding: 'base64',
          contentType: 'application/pdf',
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending license email:", error);
    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
  }
}
