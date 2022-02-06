import { useCallback, useState } from 'react';
import { getResult, prepareKlipAuth } from '../api/klip';

function useKlip() {
  const [authRequestUrl, setAuthRequestUrl] = useState<string | null>(null);

  const getKlipAddress = useCallback(async () => {
    const { data } = await prepareKlipAuth();
    const requestUrl = `https://klipwallet.com/?target=/a2a?request_key=${data.request_key}`;
    setAuthRequestUrl(requestUrl);

    window.open(requestUrl);
    return getResult(data.request_key);
  }, []);

  return {
    getKlipAddress,
    authRequestUrl,
  };
}

export default useKlip;
