import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TbX } from 'react-icons/tb';

import {
  ActionIcon,
  Button,
  Card,
  Divider,
  Fieldset,
  Flex,
  NumberInput,
  SegmentedControl,
  Slider,
  Stack,
  Switch,
  Text,
} from '@mantine/core';

import { TRIPLE_ONE_SCORE_OPTIONS } from '@farkle/core';
import PageLayout from '@pages/PageLayout';

import { useSettingsHooks } from './Settings.hooks.ts';

const Settings: FC = () => {
  const { t } = useTranslation('settings');
  const { commonPlayers, settingsForm, handleSaveSettings, removeStoredPlayer } = useSettingsHooks();

  return (
    <PageLayout title={t('common:home.settings')}>
      <form onSubmit={handleSaveSettings}>
        <Stack>
          <Fieldset legend={t('settings.minimumFirstScore.title')}>
            <Stack>
              <Flex>
                <Switch
                  {...settingsForm.getInputProps('minimumFirstScore.enabled', { type: 'checkbox' })}
                  label={t('settings.minimumFirstScore.switch')}
                />
              </Flex>
              {settingsForm.values.minimumFirstScore.enabled && (
                <NumberInput
                  {...settingsForm.getInputProps('minimumFirstScore.score')}
                  min={100}
                  max={1000}
                  step={50}
                  thousandSeparator=" "
                  label={t('settings.minimumFirstScore.score')}
                />
              )}
              {settingsForm.errors['minimumFirstScore.score'] && (
                <Text c="red" size="sm">
                  {settingsForm.errors['minimumFirstScore.score']}
                </Text>
              )}
            </Stack>
          </Fieldset>
          <Fieldset legend={t('settings.threeConsecutiveFarkle.title')}>
            <Stack>
              <Flex>
                <Switch
                  {...settingsForm.getInputProps('consecutiveFarkle.enabled', { type: 'checkbox' })}
                  label={t('settings.threeConsecutiveFarkle.switch')}
                />
              </Flex>
              {settingsForm.values.consecutiveFarkle.enabled && (
                <>
                  <Slider
                    mb="md"
                    {...settingsForm.getInputProps('consecutiveFarkle.scorePenalty')}
                    restrictToMarks
                    min={100}
                    max={1000}
                    marks={Array.from({ length: 10 }).map((_, index) => {
                      const value = (index + 1) * 100;
                      return {
                        value,
                        label: value === 100 || value === 1000 ? value.toString() : undefined,
                      };
                    })}
                  />
                  {settingsForm.errors['consecutiveFarkle.scorePenalty'] && (
                    <Text c="red" size="sm">
                      {settingsForm.errors['consecutiveFarkle.scorePenalty']}
                    </Text>
                  )}
                </>
              )}
            </Stack>
          </Fieldset>
          <Fieldset legend={t('settings.sixDiceFarkle.title')}>
            <Stack>
              <Flex>
                <Switch
                  {...settingsForm.getInputProps('sixDiceFarkle.enabled', { type: 'checkbox' })}
                  label={t('settings.sixDiceFarkle.switch')}
                />
              </Flex>
              {settingsForm.values.sixDiceFarkle.enabled && (
                <>
                  <Slider
                    mb="md"
                    {...settingsForm.getInputProps('sixDiceFarkle.score')}
                    restrictToMarks
                    min={100}
                    max={1000}
                    marks={Array.from({ length: 10 }).map((_, index) => {
                      const value = (index + 1) * 100;
                      return {
                        value,
                        label: value === 100 || value === 1000 ? value.toString() : undefined,
                      };
                    })}
                  />
                  {settingsForm.errors['sixDiceFarkle.score'] && (
                    <Text c="red" size="sm">
                      {settingsForm.errors['sixDiceFarkle.score']}
                    </Text>
                  )}
                </>
              )}
            </Stack>
          </Fieldset>
          <Fieldset legend={t('settings.tripleOneScore')}>
            <Flex direction="column">
              <SegmentedControl
                {...settingsForm.getInputProps('tripleOneScore')}
                data={TRIPLE_ONE_SCORE_OPTIONS.map(String)}
                onChange={(value) => settingsForm.setFieldValue('tripleOneScore', Number(value) as 300 | 1000)}
                value={String(settingsForm.values.tripleOneScore)}
              />
            </Flex>
          </Fieldset>
          <Fieldset legend={t('settings.revertPlayerScoreOnSameScore.title')}>
            <Flex>
              <Switch
                {...settingsForm.getInputProps('revertPlayerScoreOnSameScore', { type: 'checkbox' })}
                label={t('settings.revertPlayerScoreOnSameScore.switch')}
              />
            </Flex>
          </Fieldset>
          <Flex justify="flex-end" mt="md">
            <Button color="green" type="submit">
              {t('common:save')}
            </Button>
          </Flex>
          <Divider />
          <Fieldset legend={t('settings.storedPlayers')}>
            <Stack>
              {commonPlayers.map((player) => (
                <Card key={player.name}>
                  <Flex justify="space-between">
                    <Text>{player.name}</Text>
                    <ActionIcon color="red" onClick={() => removeStoredPlayer(player.name)}>
                      <TbX />
                    </ActionIcon>
                  </Flex>
                </Card>
              ))}
            </Stack>
          </Fieldset>
        </Stack>
      </form>
    </PageLayout>
  );
};

export default Settings;
