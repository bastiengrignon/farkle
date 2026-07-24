import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TbArrowBackUp, TbDice1, TbDice2, TbDice3, TbDice4, TbDice5, TbDice6 } from 'react-icons/tb';

import { ActionIcon, Center, Flex, Grid, Modal, Text, Title, UnstyledButton } from '@mantine/core';

import { FARKLE_SCORES } from '@farkle/core';

import { useKeyboardFirstRowHooks } from './KeyboardFirstRow.hooks.ts';
import classes from './KeyboardFirstRow.module.css';

const KeyboardFirstRow: FC = () => {
  const { t } = useTranslation('game');
  const {
    openedDiceModal,
    canUndo,
    diceType,
    addCurrentPlayerPoints,
    handleOpenDiceSelection,
    handleSetNumberOfDicePoints,
    undoAction,
    closeDiceModal,
  } = useKeyboardFirstRowHooks();

  return (
    <Flex gap="sm" justify="space-between">
      <ActionIcon size="xl" w="100%" variant="outline" onClick={undoAction} disabled={!canUndo}>
        <TbArrowBackUp size={24} />
      </ActionIcon>
      <ActionIcon size="xl" w="100%" onClick={() => addCurrentPlayerPoints(FARKLE_SCORES.FIFTY)}>
        <TbDice5 size={24} />
      </ActionIcon>
      <ActionIcon size="xl" w="100%" onClick={() => addCurrentPlayerPoints(FARKLE_SCORES.HUNDRED)}>
        <TbDice1 size={24} />
      </ActionIcon>
      <ActionIcon size="xl" w="100%" onClick={() => handleOpenDiceSelection('3')}>
        <Text size="lg">{t('keyboard.threeTimes')}</Text>
      </ActionIcon>
      <ActionIcon size="xl" w="100%" onClick={() => handleOpenDiceSelection('4')}>
        <Text size="lg">{t('keyboard.fourTimes')}</Text>
      </ActionIcon>
      {diceType && (
        <Modal opened={openedDiceModal} onClose={closeDiceModal} centered withCloseButton={false}>
          <Center mb="md">
            <Title>{t('keyboard.modal.dice', { type: diceType })}</Title>
          </Center>
          <Grid gap="xs" align="center" justify="center">
            <Grid.Col span={4} align="center">
              <UnstyledButton onClick={() => handleSetNumberOfDicePoints(1)}>
                <TbDice1 size={86} />
              </UnstyledButton>
            </Grid.Col>
            {diceType === '3' ? (
              <>
                <Grid.Col span={4} align="center">
                  <UnstyledButton onClick={() => handleSetNumberOfDicePoints(2)}>
                    <TbDice2 size={86} />
                  </UnstyledButton>
                </Grid.Col>
                <Grid.Col span={4} align="center">
                  <UnstyledButton onClick={() => handleSetNumberOfDicePoints(3)}>
                    <TbDice3 size={86} />
                  </UnstyledButton>
                </Grid.Col>
                <Grid.Col span={4} align="center">
                  <UnstyledButton onClick={() => handleSetNumberOfDicePoints(4)}>
                    <TbDice4 size={86} />
                  </UnstyledButton>
                </Grid.Col>
                <Grid.Col span={4} align="center">
                  <UnstyledButton onClick={() => handleSetNumberOfDicePoints(5)}>
                    <TbDice5 size={86} />
                  </UnstyledButton>
                </Grid.Col>
                <Grid.Col span={4} align="center">
                  <UnstyledButton onClick={() => handleSetNumberOfDicePoints(6)}>
                    <TbDice6 size={86} />
                  </UnstyledButton>
                </Grid.Col>
              </>
            ) : (
              <Grid.Col span={4} align="center">
                <UnstyledButton className={classes.otherDiceButton} onClick={() => handleSetNumberOfDicePoints(2)}>
                  <Flex justify="center">
                    <TbDice2 />
                    <TbDice3 />
                  </Flex>
                  <Flex>
                    <TbDice4 />
                    <TbDice5 />
                    <TbDice6 />
                  </Flex>
                </UnstyledButton>
              </Grid.Col>
            )}
          </Grid>
        </Modal>
      )}
    </Flex>
  );
};

export default KeyboardFirstRow;
