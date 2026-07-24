import { useTranslation } from 'react-i18next';
import { Link, useRouteError } from 'react-router';

import { Button, Card, Center, Container, Flex, Stack, Text, Title } from '@mantine/core';

import { routes } from '../../router';

type RouteError = {
  statusText: string;
};

const ErrorBoundary = () => {
  const { t } = useTranslation();
  const error = useRouteError() as RouteError | undefined;

  return (
    <Container fluid h="100vh" bg="blue.2">
      <Center h="100%">
        <Card bg="blue.4">
          <Stack gap="xl">
            <Title ta="center" c="white">
              {t('errorOccurred')}
            </Title>
            <Text fs="italic" c="white">
              {error?.statusText}
            </Text>
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
