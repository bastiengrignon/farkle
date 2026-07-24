import type { FC } from 'react';
import { TbDice6Filled, TbTrophyFilled } from 'react-icons/tb';

import clsx from 'clsx';

import { Flex, Group, Paper, Progress, RollingNumber, ScrollArea, Text } from '@mantine/core';

import type { Game, GamePlayer, TurnResult } from '@farkle/core';

import { usePlayersScoreHooks } from './PlayersScore.hooks';
import classes from './PlayersScore.module.css';

interface PlayersScoreProps {
  game: Game;
  turnHistory: TurnResult[];
  onPlayerClick?: (playerId: string) => void;
}

const getTopScorePlayers = (players: GamePlayer[]): string[] => {
  if (players.length === 0) {
    return [];
  }
  const topScore = Math.max(...players.map(({ score }) => score));
  if (topScore === 0) {
    return [];
  }
  return players.filter(({ score }) => score === topScore).map(({ id }) => id);
};

const PlayersScore: FC<PlayersScoreProps> = ({ game, turnHistory, onPlayerClick }) => {
  const { playerColors, getPlayerTurnCount } = usePlayersScoreHooks({ game, turnHistory });

  return (
    <ScrollArea flex={1} mih={0} my="md">
      {game.players.map((player, index) => {
        const progress = game.scoreToReach > 0 ? Math.min((player.score / game.scoreToReach) * 100, 100) : 0;
        const turnStats = getPlayerTurnCount(player.id);
        const hasHistory = turnStats.banked > 0 || turnStats.farkles > 0;
        return (
          <Paper
            key={player.id}
            withBorder
            p="md"
            mb="md"
            shadow={game.currenPlayerIdTurn === player.id ? 'lg' : 'none'}
            bd={game.currenPlayerIdTurn === player.id ? '1px solid green' : '1px solid gray'}
            pos="relative"
            className={clsx(classes.playerScoreContainer, { [classes.playerScoreContainerHasHistory]: hasHistory })}
            onClick={() => onPlayerClick?.(player.id)}
          >
            <Progress
              value={progress}
              color={playerColors[index]}
              radius="md"
              size="xs"
              classNames={{
                root: classes.playerScoreProgressContainer,
              }}
            />
            <Flex justify="space-between" align="center" style={{ position: 'relative', zIndex: 1 }}>
              <Group align="center" gap="xs">
                <Text fw={game.currenPlayerIdTurn === player.id ? 'bold' : 'normal'}>{player.name}</Text>
                {game.currenPlayerIdTurn === player.id && <TbDice6Filled className={classes.currentPlayerTurnDice} />}
              </Group>
              <Group align="center" gap="xs">
                {getTopScorePlayers(game.players).includes(player.id) && (
                  <TbTrophyFilled color="var(--mantine-color-yellow-6)" size={24} />
                )}
                <RollingNumber thousandSeparator=" " value={player.score || 0} />
              </Group>
            </Flex>
          </Paper>
        );
      })}
    </ScrollArea>
  );
};

export default PlayersScore;
