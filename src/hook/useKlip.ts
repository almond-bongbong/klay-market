import { useCallback, useState } from 'react';
import {
  getResult,
  prepareExecuteStoreContract,
  prepareKlipAuth,
} from '../api/klip';

function useKlip() {
  const [authRequestUrl, setAuthRequestUrl] = useState<string | null>(null);

  const requestKlipAuth = (requestKey: string) => {
    const requestUrl = `https://klipwallet.com/?target=/a2a?request_key=${requestKey}`;
    setAuthRequestUrl(requestUrl);
    // window.open(requestUrl);
  };

  const getKlipAddress = useCallback(async () => {
    const { data } = await prepareKlipAuth();
    requestKlipAuth(data.request_key);
    return getResult(data.request_key);
  }, []);

  const storeValue = async (value: number) => {
    const { data } = await prepareExecuteStoreContract(value);
    requestKlipAuth(data.request_key);
    return getResult(data.request_key);
  };

  return {
    authRequestUrl,
    getKlipAddress,
    storeValue,
  };
}

export default useKlip;
