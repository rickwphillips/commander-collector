import { DeckDetail } from './DeckDetail';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DeckDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <DeckDetail deckId={Number(id)} />;
}
