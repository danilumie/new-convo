import { Metadata } from 'next';
import ConversationView from '@/components/ConversationView';

export const metadata: Metadata = {
  title: 'Chat Session'
};

type PageProps = {
  params: Promise<{ sessionId: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ChatPage({ params }: PageProps) {
  const { sessionId } = await params;
  return <ConversationView sessionId={sessionId} />;
}