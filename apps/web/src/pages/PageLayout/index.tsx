import type { FC, ReactNode } from 'react';
import { TbChevronLeft } from 'react-icons/tb';
import { useNavigate } from 'react-router';

import { ActionIcon, Card, Flex, Title } from '@mantine/core';

interface PageLayoutProps {
  title: string;
  children: ReactNode;
}

const PageLayout: FC<PageLayoutProps> = ({ title, children }) => {
  const navigate = useNavigate();
  return (
    <Card>
      <Flex justify="space-between" align="center" mb="md">
        <ActionIcon onClick={() => navigate(-1)}>
          <TbChevronLeft />
        </ActionIcon>
        <Title order={3}>{title}</Title>
        <div />
      </Flex>
      {children}
    </Card>
  );
};

export default PageLayout;
