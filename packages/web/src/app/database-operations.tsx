'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function DatabaseOperations() {
  const [isWiping, setIsWiping] = useState(false);
  const [isPopulating, setIsPopulating] = useState(false);

  const wipeDatabase = async () => {
    setIsWiping(true);
    await fetch('/api/wipe-database');
    setIsWiping(false);
  };

  const populateDatabase = async () => {
    setIsPopulating(true);
    await fetch('/api/populate-database');
    setIsPopulating(false);
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
