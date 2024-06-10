import type { ReactNode } from 'react';
import MainLayout from '../../../src-old/layouts/main';
import ManageLayout from '../../../src-old/layouts/manage';

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
