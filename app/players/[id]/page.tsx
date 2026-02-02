import { PlayerDetail } from './PlayerDetail';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PlayerDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <PlayerDetail playerId={Number(id)} />;
}
