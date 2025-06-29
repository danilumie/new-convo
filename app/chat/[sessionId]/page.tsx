import ConversationView from '@/components/ConversationView';

interface ChatPageProps {
  params: {
    sessionId: string;
  };
}

export default function ChatPage({ params }: ChatPageProps) {
  return <ConversationView sessionId={params.sessionId} />;
}