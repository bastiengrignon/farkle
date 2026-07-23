import { Outlet, Link, useLocation } from "react-router-dom";
import {
  AppShell,
  Navbar,
  Group,
  Text,
  NavLink,
  Box,
  useMantineColorScheme,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { useTranslation } from "@tolgee/react";
import {
  IconHome,
  IconDice,
  IconSettings,
  IconTrophy,
  IconHelp,
  IconSun,
  IconMoon,
} from "@tabler/icons-react";
import classes from "./Layout.module.css";

const navItems = [
  { label: "home.title", path: "/", icon: IconHome },
  { label: "home.play_now", path: "/game", icon: IconDice },
  { label: "home.leaderboard", path: "/leaderboard", icon: IconTrophy },
  { label: "home.rules", path: "/rules", icon: IconHelp },
  { label: "home.settings", path: "/settings", icon: IconSettings },
];

export function Layout() {
  const { t } = useTranslation();
  const location = useLocation();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <AppShell
      navbar={
        <Navbar width={{ base: 80 }} p="xs">
          <Navbar.Section grow>
            <Group align="center" justify="center" gap="xs">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Tooltip key={item.path} label={t(item.label)} position="right">
                    <NavLink
                      component={Link}
                      to={item.path}
                      active={isActive}
                      label={t(item.label)}
                      leftSection={<item.icon size={20} stroke={1.5} />}
                      className={classes.navLink}
                    />
                  </Tooltip>
                );
              })}
            </Group>
          </Navbar.Section>
          <Navbar.Section>
            <ActionIcon
              onClick={() => toggleColorScheme()}
              variant="subtle"
              color="gray"
              size="lg"
              aria-label="Toggle color scheme"
            >
              {colorScheme === "dark" ? (
                <IconSun size={20} stroke={1.5} />
              ) : (
                <IconMoon size={20} stroke={1.5} />
              )}
            </ActionIcon>
          </Navbar.Section>
        </Navbar>
      }
      padding="md"
    >
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

export default Layout;
