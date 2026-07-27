import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { type ErrorResponse, isRouteErrorResponse, Link, useRouteError } from 'react-router';

import type { TFunction } from 'i18next';

import { Button, Card, Center, Container, Flex, Stack, Text, Title } from '@mantine/core';

import { routes } from '../../router';

const RouteErrorDisplay: FC<{ error: ErrorResponse }> = ({ error }) => (
  <Stack>
    <Title order={2} ta="center" c="white">
      {error.status} {error.statusText}
    </Title>
    <Text>{error.data}</Text>
  </Stack>
);

const ErrorDisplay: FC<{ error: Error; t: TFunction }> = ({ error, t }) => (
  <>
    <Title order={2} ta="center" c="white">
      {t('error', { message: error.message })}
    </Title>
    {/*
    {error.message !== error.stack && (
      <Title order={2} ta="center" c="white">
        Stack: {error.stack}
      </Title>
    )}
*/}
  </>
);

const ErrorBoundary: FC = () => {
  const { t } = useTranslation();
  const error = useRouteError();
  const isRouteError = isRouteErrorResponse(error);

  return (
    <Container fluid h="100vh" bg="blue.2">
      <Center h="100%">
        <Card bg="blue.4">
          <Stack gap="xl">
            <Title ta="center" c="white">
              {t('errorOccurred')}
            </Title>
            {isRouteError ? <RouteErrorDisplay error={error} /> : <ErrorDisplay error={error as Error} t={t} />}
            <Flex justify="center">
              <Button variant="gradient" component={Link} to={routes.home}>
                {t('goBack')}
              </Button>
            </Flex>
          </Stack>
        </Card>
      </Center>
    </Container>
  );
};

export default ErrorBoundary;
