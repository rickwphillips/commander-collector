'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Alert } from '@mui/material';
import { PageContainer } from '../../components/PageContainer';
import { GameForm } from '../../components/GameForm';

export default function EditGamePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gameId = Number(searchParams.get('id'));

  const handleSuccess = (id: number) => {
    router.push(`/games/detail?id=${id}`);
  };

  if (!gameId) {
    return (
      <PageContainer title="Edit Game" backHref="/games" backLabel="Back to Games">
        <Alert severity="error">No game ID provided</Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Edit Game"
      subtitle="Modify game details and results"
      backHref={`/games/detail?id=${gameId}`}
      backLabel="Back to Game"
    >
      <GameForm mode="edit" gameId={gameId} onSuccess={handleSuccess} />
    </PageContainer>
  );
}
