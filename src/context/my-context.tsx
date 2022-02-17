import { createContext, ReactNode, useContext, useState } from 'react';

interface Me {
  address: string;
  balance: string;
}

interface Context {
  me: Me | null;
  setMe: (me: Me | null) => void;
}

const MyContext = createContext<Context>({
  me: null,
  setMe: () => null,
});

interface Props {
  children: ReactNode;
}

export function MyProvider({ children }: Props) {
  const [me, setMe] = useState<Me | null>(null);

  return (
    <MyContext.Provider value={{ me, setMe }}>{children}</MyContext.Provider>
  );
}

export function useMyContext() {
  return useContext(MyContext);
}
