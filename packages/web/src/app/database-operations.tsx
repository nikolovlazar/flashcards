'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DatabaseOperations() {
  const [isWiping, setIsWiping] = useState(false);
  const [isPopulating, setIsPopulating] = useState(false);
  const router = useRouter();

  const wipeDatabase = async () => {
    setIsWiping(true);
    await fetch('/api/wipe-database');
    setIsWiping(false);
    router.refresh();
  };

  const populateDatabase = async () => {
    setIsPopulating(true);
    await fetch('/api/populate-database');
    setIsPopulating(false);
    router.refresh();
  };

  return (
    <>
      <Button variant='outline' onClick={wipeDatabase} disabled={isWiping}>
        {isWiping ? 'Wiping...' : 'Wipe Database'}
      </Button>
      <Button
        variant='outline'
        onClick={populateDatabase}
        disabled={isPopulating}
      >
        {isPopulating ? 'Populating...' : 'Populate Database'}
      </Button>
    </>
  );
}
