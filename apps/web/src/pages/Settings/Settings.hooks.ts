import { useCallback } from 'react';

import type { TFunction } from 'i18next';

import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

import { type FarkleSettings, TRIPLE_ONE_SCORE_OPTIONS } from '@farkle/core';
import { useFarkleStore } from '@store/farkle';

interface UseSettingsHooksProps {
  t: TFunction;
}

export const useSettingsHooks = ({ t }: UseSettingsHooksProps) => {
  const commonPlayers = useFarkleStore((state) => state.players);
  const settings = useFarkleStore((state) => state.settings);
  const removeStoredPlayer = useFarkleStore((state) => state.removeStoredPlayer);
  const updateSettings = useFarkleStore((state) => state.updateSettings);

  const settingsForm = useForm<FarkleSettings>({
    initialValues: settings,
    validate: {
      consecutiveFarkle: {
        scorePenalty: (value) =>
          value >= 100 && value <= 1000 && value % 100 === 0
            ? null
            : 'The score penalty must be between 100 and 1000, in increments of 100',
      },
      sixDiceFarkle: {
        score: (value) =>
          value >= 100 && value <= 1000 && value % 100 === 0
            ? null
            : 'The six-dice Farkle score must be between 100 and 1000, in increments of 100',
      },
      minimumFirstScore: {
        score: (value) =>
          value >= 100 && value <= 1000 && value % 50 === 0
            ? null
            : 'The minimum first score must be between 100 and 1000, in increments of 50',
      },
      tripleOneScore: (value) =>
        TRIPLE_ONE_SCORE_OPTIONS.includes(value) ? null : 'The triple one score must be 300 or 1000',
    },
  });

  const handleSaveSettings = useCallback(
    (values: FarkleSettings) => {
      updateSettings(values);
      notifications.show({
        message: t('settings.saved'),
        autoClose: 3000,
        position: 'top-center',
        color: 'green',
      });
    },
    [updateSettings, t]
  );

  return {
    commonPlayers,
    settingsForm,
    handleSaveSettings,
    removeStoredPlayer,
  };
};
