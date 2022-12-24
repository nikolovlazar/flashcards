'use client';

import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { Link } from '@chakra-ui/react';

type SidebarItemProps = {
  title: string;
  icon?: React.ReactNode;
  href: string;
};

export const SidebarLink = ({ title, icon, href }: SidebarItemProps) => {
  const pathname = usePathname();
  const isActive = pathname?.startsWith(href);

  return (
    <Link
      as={NextLink}
      href={href}
      w='full'
      px={2}
      py={1}
      color={isActive ? 'linkActiveText' : 'linkText'}
      rounded='md'
      background={isActive ? 'linkActiveBackground' : 'linkBackground'}
      _hover={{
        textDecoration: 'none',
        bg: isActive ? 'linkActiveBackground' : 'linkHoverBackground',
      }}
    >
      {icon}
      {title}
    </Link>
  );
};
