import type { ReactNode } from 'react';

import MainLayout from '../../src/layouts/main';
import PracticeLayout from '../../src/layouts/practice';

export default function Page() {
  return <></>;
}

Page.getLayout = (page: ReactNode) => (
  <MainLayout>
    <PracticeLayout>{page}</PracticeLayout>
  </MainLayout>
);
