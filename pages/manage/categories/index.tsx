import type { ReactNode } from 'react';
import MainLayout from '../../../src/layouts/main';
import ManageLayout from '../../../src/layouts/manage';

export default function Page() {
  return <></>;
}

Page.getLayout = (page: ReactNode) => {
  return (
    <MainLayout>
      <ManageLayout>{page}</ManageLayout>
    </MainLayout>
  );
};
