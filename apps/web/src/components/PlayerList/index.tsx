import { type FC, useRef } from 'react';
import { TbMenuOrder, TbX } from 'react-icons/tb';

import { useSortable } from '@dnd-kit/react/sortable';
import clsx from 'clsx';

import { ActionIcon, Checkbox, Group, TextInput, ThemeIcon } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';

import type { NewGameFormValues } from '../ModalNewGame/ModalNewGame.hooks';
import classes from './PlayerList.module.css';

interface PlayerListProps {
  player: NewGameFormValues['players'][number];
  index: number;
  form: UseFormReturnType<NewGameFormValues>;
}

const PlayerList: FC<PlayerListProps> = ({ player, index, form }) => {
  const handleRef = useRef<HTMLDivElement | null>(null);
  const { ref, isDragging } = useSortable({ id: player.id, index });

  return (
    <Group
      align="center"
      gap="xs"
      ref={ref}
      className={clsx({
        [classes.isDragging]: isDragging,
      })}
    >
      <Checkbox
        aria-label={player.name || `Player ${index + 1}`}
        {...form.getInputProps(`players.${index}.selected`, { type: 'checkbox' })}
      />
      <TextInput
        size="xs"
        style={{ flex: 1 }}
        placeholder={`Player ${index + 1}`}
        {...form.getInputProps(`players.${index}.name`)}
      />
      <ThemeIcon color="gray" size="md" ref={handleRef} className={classes.orderingMenu}>
        <TbMenuOrder />
      </ThemeIcon>
      <ActionIcon color="red" size="md" onClick={() => form.removeListItem('players', index)}>
        <TbX />
      </ActionIcon>
    </Group>
  );
};

export default PlayerList;
