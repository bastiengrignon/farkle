import { useDisclosure } from '@mantine/hooks';

export const useHomePageHooks = () => {
  const [openedNewGameModal, { open: openNewGameModal, close: closeNewGameModal }] = useDisclosure(false);

  return {
    openedNewGameModal,
    openNewGameModal,
    closeNewGameModal,
  };
};
