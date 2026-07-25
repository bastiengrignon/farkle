import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import PageLayout from '@pages/PageLayout';

import FarkleRules from '../../assets/rules.mdx';

const Rules: FC = () => {
  const { t } = useTranslation('rules');
  return (
    <PageLayout title={t('common:home.rules')}>
      <FarkleRules />
    </PageLayout>
  );
};

export default Rules;
