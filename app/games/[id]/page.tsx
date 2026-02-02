import { GameDetail } from './GameDetail';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function GameDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <GameDetail gameId={Number(id)} />;
}
