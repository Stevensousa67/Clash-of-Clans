import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { ContactEmail } from '@/components/sections/contact/Email';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { name, email, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send email using Resend with React component
    const { data, error } = await resend.emails.send({
      from: 'ss@stevensousa.com',
      to: 'silver.steven@hotmail.com',
      subject: `Project Clash of Clans Message From ${name}`,
      react: ContactEmail({ name, email, message }),
      replyTo: email,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Email sent successfully', id: data?.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}