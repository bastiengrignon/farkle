import { type FC, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import clsx from 'clsx';

import { ActionIcon, Box, Group, Menu, Text, ThemeIcon } from '@mantine/core';

import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../../i18n/config';
import classes from './LanguageSwitcher.module.css';

const supportedLanguagesTranslations: Record<SupportedLanguage, string> = {
  fr: 'Français',
  en: 'English',
};

const LanguageSwitcher: FC = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.resolvedLanguage);
  const [opened, setOpened] = useState(false);

  const handleChangeLanguage = useCallback(
    (lng: string) => i18n.changeLanguage(lng).then(() => setCurrentLanguage(lng)),
    [i18n]
  );
  const supportedLanguages = SUPPORTED_LANGUAGES.map((value) => ({
    value,
    label: supportedLanguagesTranslations[value],
  }));

  return (
    <Menu
      opened={opened}
      onChange={setOpened}
      radius="md"
      width={120}
      withArrow
      position="bottom-end"
      arrowPosition="center"
      shadow="lg"
    >
      <Menu.Target>
        <ActionIcon>
          <ThemeIcon>
            <Box w={16} className={`fi fi-${currentLanguage === 'en' ? 'us' : currentLanguage}`} />
          </ThemeIcon>
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        {supportedLanguages.map(({ value, label }) => (
          <Menu.Item
            key={value}
            onClick={() => handleChangeLanguage(value)}
            className={clsx({
              [classes.selectedLanguage]: currentLanguage === value,
            })}
          >
            <Group gap="xs" wrap="nowrap" align="center">
              <Box w={16} className={`fi fi-${value === 'en' ? 'us' : value}`} />
              <Text size="sm">{label}</Text>
            </Group>
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

export default LanguageSwitcher;
