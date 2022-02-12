import { createContext, ReactNode, useContext, useState } from 'react';

interface Context {
  address: null | string;
  setAddress: (address: string) => void;
}

const MyContext = createContext<Context>({
  address: null,
  setAddress: () => null,
});

interface Props {
  children: ReactNode;
}

export function MyProvider({ children }: Props) {
  const [address, setAddress] = useState<string | null>(null);

  return (
    <MyContext.Provider value={{ address, setAddress }}>
      {children}
    </MyContext.Provider>
  );
}

export function useMyContext() {
  return useContext(MyContext);
}
