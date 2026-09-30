import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { sendContactInquiryEmail } from '@/lib/email';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdminApi } from '@/lib/supabase/auth';
import { rateLimit } from '@/lib/rate-limit';

const MESSAGES_FILE = path.join(process.cwd(), 'data', 'messages.json');

function saveMessageLocally(messageData: any) {
  try {
    const dir = path.dirname(MESSAGES_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    let messages = [];
    if (fs.existsSync(MESSAGES_FILE)) {
      const raw = fs.readFileSync(MESSAGES_FILE, 'utf-8');
      messages = JSON.parse(raw);
      if (!Array.isArray(messages)) messages = [];
    }

    messages.unshift(messageData);
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save message to data/messages.json:', err);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message, website } = body;

    // Honeypot: the "website" field is hidden from people, so only bots fill it in.
    // Pretend success so they don't retry.
    if (website) {
      return NextResponse.json({ success: true, message: 'Your message has been sent successfully.' });
    }

    // 5 messages per hour per visitor keeps the inbox safe from floods
    const limited = await rateLimit(req, 'contact', 5, 3600);
    if (limited) return limited;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Please provide name, email, and message.' },
        { status: 400 }
      );
    }

    if (String(name).length > 200 || String(email).length > 320 || String(message).length > 5000) {
      return NextResponse.json({ error: 'Please keep your message under 5000 characters.' }, { status: 400 });
    }

    const messageRecord = {
      id: `msg-${Date.now()}`,
      name: String(name).trim(),
      email: String(email).trim(),
      message: String(message).trim(),
      status: 'unread',
      created_at: new Date().toISOString(),
    };

    // 1. Save message for the Admin dashboard (database, or local file in demo mode)
    const adminClient = createAdminClient();
    if (adminClient) {
      const { data, error } = await adminClient
        .from('contact_messages')
        .insert({ name: messageRecord.name, email: messageRecord.email, message: messageRecord.message })
        .select('id')
        .single();
      if (error) throw new Error(`Could not save your message: ${error.message}`);
      messageRecord.id = data.id;
    } else {
      saveMessageLocally(messageRecord);
    }

    // 2. Dispatch email to store administrator
    await sendContactInquiryEmail({
      name: messageRecord.name,
      email: messageRecord.email,
      message: messageRecord.message,
    });

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully. Our team will get back to you shortly.',
      id: messageRecord.id,
    });
  } catch (error: any) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send message' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const adminClient = createAdminClient();
  if (adminClient) {
    const { data, error } = await adminClient
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  try {
    if (fs.existsSync(MESSAGES_FILE)) {
      const raw = fs.readFileSync(MESSAGES_FILE, 'utf-8');
      const messages = JSON.parse(raw);
      return NextResponse.json(messages);
    }
    return NextResponse.json([]);
  } catch (err) {
    return NextResponse.json([], { status: 200 });
  }
}
