import {
  Group,
  Box,
  Paper,
  Text,
  useMantineTheme,
  useMantineColorScheme,
} from "@mantine/core";
import type { DiceRoll } from "@farkle/core";
import classes from "./DiceDisplay.module.css";

interface DiceDisplayProps {
  dice: DiceRoll;
  selectedDice: boolean[];
  onSelectDie: (index: number) => void;
}

const DICE_COLORS = [
  "#e74c3c", // 1 - Red
  "#3498db", // 2 - Blue
  "#2ecc71", // 3 - Green
  "#f39c12", // 4 - Orange
  "#9b59b6", // 5 - Purple
  "#1abc9c", // 6 - Teal
];

const DICE_DOTS: Record<number, JSX.Element> = {
  1: (
    <Box className={classes.diceDots}>
      <Box className={classes.dot} style={{ top: "50%", left: "50%" }} />
    </Box>
  ),
  2: (
    <Box className={classes.diceDots}>
      <Box className={classes.dot} style={{ top: "20%", right: "20%" }} />
      <Box className={classes.dot} style={{ bottom: "20%", left: "20%" }} />
    </Box>
  ),
  3: (
    <Box className={classes.diceDots}>
      <Box className={classes.dot} style={{ top: "20%", right: "20%" }} />
      <Box className={classes.dot} style={{ top: "50%", left: "50%" }} />
      <Box className={classes.dot} style={{ bottom: "20%", left: "20%" }} />
    </Box>
  ),
  4: (
    <Box className={classes.diceDots}>
      <Box className={classes.dot} style={{ top: "20%", right: "20%" }} />
      <Box className={classes.dot} style={{ top: "20%", left: "20%" }} />
      <Box className={classes.dot} style={{ bottom: "20%", right: "20%" }} />
      <Box className={classes.dot} style={{ bottom: "20%", left: "20%" }} />
    </Box>
  ),
  5: (
    <Box className={classes.diceDots}>
      <Box className={classes.dot} style={{ top: "20%", right: "20%" }} />
      <Box className={classes.dot} style={{ top: "20%", left: "20%" }} />
      <Box className={classes.dot} style={{ top: "50%", left: "50%" }} />
      <Box className={classes.dot} style={{ bottom: "20%", right: "20%" }} />
      <Box className={classes.dot} style={{ bottom: "20%", left: "20%" }} />
    </Box>
  ),
  6: (
    <Box className={classes.diceDots}>
      <Box className={classes.dot} style={{ top: "20%", right: "20%" }} />
      <Box className={classes.dot} style={{ top: "20%", left: "20%" }} />
      <Box className={classes.dot} style={{ top: "50%", right: "20%" }} />
      <Box className={classes.dot} style={{ top: "50%", left: "20%" }} />
      <Box className={classes.dot} style={{ bottom: "20%", right: "20%" }} />
      <Box className={classes.dot} style={{ bottom: "20%", left: "20%" }} />
    </Box>
  ),
};

export function DiceDisplay({ dice, selectedDice, onSelectDie }: DiceDisplayProps) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  return (
    <Group justify="center" gap="md">
      {dice.map((value, index) => {
        const isSelected = selectedDice[index];
        const diceColor = DICE_COLORS[value - 1];
        
        return (
          <Paper
            key={index}
            radius="md"
            p={0}
            shadow="sm"
            withBorder
            className={`${classes.dice} ${isSelected ? classes.selected : ""}`}
            onClick={() => onSelectDie(index)}
            style={{
              borderColor: isSelected ? theme.colors.blue[5] : theme.colors.gray[4],
              backgroundColor: colorScheme === "dark" ? theme.colors.dark[5] : "white",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            aria-label={`Dice showing ${value}`}
          >
            <Box
              style={{
                width: 60,
                height: 60,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <Text
                size="xl"
                fw={700}
                c={diceColor}
                style={{
                  position: "absolute",
                  top: 4,
                  left: 4,
                  fontSize: 12,
                }}
              >
                {value}
              </Text>
              {DICE_DOTS[value]}
            </Box>
          </Paper>
        );
      })}
    </Group>
  );
}

export default DiceDisplay;
