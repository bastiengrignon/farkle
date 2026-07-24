import { Card, createTheme, Switch } from '@mantine/core';

export const theme = createTheme({
  cursorType: 'pointer',
  primaryColor: 'blue',
  components: {
    Card: Card.extend({
      defaultProps: {
        radius: 'md',
      },
    }),
    Switch: Switch.extend({
      defaultProps: {
        withThumbIndicator: false,
      },
    }),
  },
});
