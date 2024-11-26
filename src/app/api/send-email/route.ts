import { NextResponse } from 'next/server';
import sg from '@sendgrid/mail';

sg.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(req) {
  try {
    // Parse the request body
    const { from, to, subject, message } = await req.json();

    console.log("From:", from, "To:", to, "subject:", subject, "Message: ", message);
    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, message' },
        { status: 400 }
      );
    }

    // Send the email using sg
    await sg.send({
      to: to,
      from: "taaseenmkhan@gmail.com", // Verified sender email in sg
      subject: subject,
      text: message,
    });

    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('sg error:', error);
    return NextResponse.json(
      { error: 'Failed to send email', details: error.message },
      { status: 500 }
    );
  }
}
