import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendMessage, getConversation } from '@/lib/database/connection';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const otherUserId = searchParams.get('otherUserId');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!otherUserId) {
      return NextResponse.json({ error: 'Other user ID is required' }, { status: 400 });
    }

    const messages = await getConversation(session.user.id, otherUserId, limit);

    return NextResponse.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { receiverId, content, messageType = 'text', mediaUrl } = body;

    if (!receiverId || !content) {
      return NextResponse.json({ error: 'Receiver ID and content are required' }, { status: 400 });
    }

    const message = await sendMessage({
      senderId: session.user.id,
      receiverId,
      content,
      messageType,
      mediaUrl,
    });

    return NextResponse.json({
      success: true,
      data: message,
      message: 'Message sent successfully',
    });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
