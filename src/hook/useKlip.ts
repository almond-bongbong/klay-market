import { useCallback, useState } from 'react';
import { getResult, prepareKlipAuth } from '../api/klip';
import { ua } from '../lib/ua';

function useKlip() {
  const [authRequestUrl, setAuthRequestUrl] = useState<string | null>(null);

  const requestKlipAuth = (requestKey: string) => {
    const requestUrl = `https://klipwallet.com/?target=/a2a?request_key=${requestKey}`;
    setAuthRequestUrl(requestUrl);

    if (ua().device.type === 'mobile') {
      window.open(requestUrl);
    }
  };

  const getKlipAddress = useCallback(async () => {
    const { data } = await prepareKlipAuth();
    requestKlipAuth(data.request_key);
    return getResult(data.request_key);
  }, []);

  return {
    authRequestUrl,
    getKlipAddress,
  };
}

export default useKlip;
