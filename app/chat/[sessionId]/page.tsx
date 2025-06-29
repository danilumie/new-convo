import { Metadata } from 'next';
import ConversationView from '@/components/ConversationView';

export const metadata: Metadata = {
  title: 'Chat Session'
};

type PageProps = {
  params: { sessionId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default function ChatPage({ params }: PageProps) {
  return <ConversationView sessionId={params.sessionId} />;
}