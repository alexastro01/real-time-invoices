import StreamStartedEmail from '@/components/email/StreamStartedEmail';
import { format } from 'date-fns';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

type StreamStartedEmail = {
  payerName: string;
  payeeName: string;
  amount: string;
  dueDate: any;
  receiverEmail: string;
  link: string;
}

export async function POST(request: Request) {
  try {
    const { payerName, payeeName, amount, dueDate, receiverEmail, link }: StreamStartedEmail = await request.json();

    console.log('Received email data:', { payerName, payeeName, amount, dueDate, receiverEmail, link });

    const formattedDueDate = format(dueDate * 1000, 'PP');

    if (!payerName || !payeeName || !amount || !dueDate || !link) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(receiverEmail)) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'Streambill@info.streambill.xyz',
      to: [receiverEmail],
      subject: 'You received an invoice',
      react: StreamStartedEmail({ payerName, payeeName, amount, formattedDueDate, link }),
    });

    if (error) {
      console.error('Resend API error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data);
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}