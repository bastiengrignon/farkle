import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TbRefresh } from 'react-icons/tb';

import axios from 'axios';

import { Button, Title } from '@mantine/core';
import { useInterval } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';

import { semverGreaterThan } from '@constants/version';

import packageJson from '../../package.json';

const CHECK_NEW_VERSION_INTERVAL = 1000 * 60 * 5;

export const usePWABanner = () => {
  const { t } = useTranslation();

  const interval = useInterval(async () => {
    const { data } = await axios.get('/meta.json');
    const needRefresh = semverGreaterThan(data.version, packageJson.version);
    if (needRefresh) {
      notifications.show({
        title: <Title order={4}>Nouvelle version disponible</Title>,
        message: (
          <Button
            mt="xs"
            size="xs"
            rightSection={<TbRefresh />}
            color="yellow"
            onClick={() => window.location.reload()}
          >
            {t('refresh')}
          </Button>
        ),
        autoClose: CHECK_NEW_VERSION_INTERVAL - 200,
        color: 'yellow',
      });
    }
  }, CHECK_NEW_VERSION_INTERVAL);

  useEffect(() => {
    interval.start();
    return interval.stop;
  }, [interval]);
};
