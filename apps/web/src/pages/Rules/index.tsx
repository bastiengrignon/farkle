import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import PageLayout from '@pages/PageLayout';

const Rules: FC = () => {
  const { t } = useTranslation('rules');
  return <PageLayout title={t('common:home.rules')}>List of rules</PageLayout>;
};

export default Rules;
