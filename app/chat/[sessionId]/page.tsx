import ConversationView from '@/components/ConversationView';

type Props = {
  params: { sessionId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function ChatPage({ params }: Props) {
  return <ConversationView sessionId={params.sessionId} />;
}