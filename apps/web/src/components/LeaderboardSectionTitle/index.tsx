import type { FC } from 'react';
import { TbTrophy } from 'react-icons/tb';

import { Group, Title } from '@mantine/core';

const LeaderboardSectionTitle: FC<{ title: string }> = ({ title }) => (
  <Group gap="xs">
    <TbTrophy size={24} />
    <Title order={3}>{title}</Title>
  </Group>
);

export default LeaderboardSectionTitle;
