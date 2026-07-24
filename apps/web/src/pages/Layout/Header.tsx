import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TbDice6 } from 'react-icons/tb';
import { Link } from 'react-router';

import { Anchor, Flex, Group, ThemeIcon, Title } from '@mantine/core';

import LanguageSwitcher from '@components/LanguageSwitcher';
import { useCustomMediaQuery } from '@constants/hooks';
import ColorSwitcher from '@pages/Layout/ColorSwitcher';

import { routes } from '../../router';

const Header: FC = () => {
  const { t } = useTranslation();
  const isMobile = useCustomMediaQuery();

  return (
    <Flex align="center" justify="space-between" h="100%">
      <Anchor c="dark" underline="never" component={Link} to={routes.home}>
        <Group gap="xs" align="center">
          <ThemeIcon variant="transparent" size="xl">
            <TbDice6 size={isMobile ? 25 : 40} color="white" />
          </ThemeIcon>
          <Title order={isMobile ? 3 : 2} c="white">
            {t('home.brand')}
          </Title>
        </Group>
      </Anchor>
      <Group gap="xs" align="center">
        <ColorSwitcher />
        <LanguageSwitcher />
      </Group>
    </Flex>
  );
};

export default Header;
