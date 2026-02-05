'use client';

import { useRouter } from 'next/navigation';
import { PageContainer } from '../../components/PageContainer';
import { GameForm } from '../../components/GameForm';

export default function NewGamePage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/games');
  };

  return (
    <PageContainer
      title="Log New Game"
      subtitle="Record the results of your Commander match"
      backHref="/games"
      backLabel="Back to Games"
    >
      <GameForm mode="create" onSuccess={handleSuccess} />
    </PageContainer>
  );
}
