import React from 'react';

type MainSidebarContextProps = {
  isOpened: boolean;
  open: () => void;
  close: () => void;
};

const MainSidebarContext = React.createContext<MainSidebarContextProps>({
  isOpened: false,
  open: () => {},
  close: () => {},
});

export function MainSidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpened, setIsOpened] = React.useState(false);

  const open = React.useCallback(() => {
    setIsOpened(true);
  }, []);

  const close = React.useCallback(() => {
    setIsOpened(false);
  }, []);

  return (
    <MainSidebarContext.Provider value={{ isOpened, open, close }}>
      {children}
    </MainSidebarContext.Provider>
  );
}

export function useMainSidebar() {
  return React.useContext(MainSidebarContext);
}
