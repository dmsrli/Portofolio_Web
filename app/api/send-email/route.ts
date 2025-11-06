import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Please fill all fields.' }, { status: 400 });
    }

    const data = await resend.emails.send({
      from: `${process.env.CONTACT_SENDER_NAME || 'Portfolio Contact'} <onboarding@resend.dev>`,
      to: process.env.CONTACT_RECEIVER_EMAIL!,
      subject: `📬 New Message from ${name}`,
      reply_to: email,
      text: `
        Name: ${name}
        Email: ${email}
        Message:
        ${message}
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Send email failed:', error);
    return NextResponse.json({ error: error.message || 'Failed to send email.' }, { status: 500 });
  }
}
